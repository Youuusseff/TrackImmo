#!/usr/bin/env python
# coding: utf-8

import pyspark
from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml.feature import VectorAssembler, StringIndexer, OneHotEncoder, StandardScaler, Imputer
from pyspark.ml.evaluation import BinaryClassificationEvaluator, MulticlassClassificationEvaluator
from pyspark.sql.functions import col, year, month, to_date, when, regexp_replace, lit, avg, count, desc, round
from pyspark.sql.window import Window
from pyspark.sql.functions import percentile_approx, lag, lead, first, pow
from pyspark.sql.types import FloatType, IntegerType, StringType, StructType, StructField, DateType
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from pymongo import MongoClient


spark = SparkSession.builder \
    .appName("lebonici") \
    .enableHiveSupport() \
    .config("spark.local.dir", "/home/hdoop/spark-temp") \
    .config("spark.storage.level", "MEMORY_AND_DISK") \
    .config("spark.executor.memory", "12g") \
    .config("spark.driver.memory", "12g") \
    .config("spark.driver.memoryOverhead", "3g") \
    .config("spark.executor.memoryOverhead", "3g") \
    .config("spark.memory.fraction", "0.7") \
    .config("spark.memory.storageFraction", "0.3") \
    .config("spark.sql.shuffle.partitions", "100") \
    .config("spark.default.parallelism", "100") \
    .config("spark.sql.autoBroadcastJoinThreshold", "5m") \
    .config("spark.network.timeout", "1200s") \
    .config("spark.executor.heartbeatInterval", "120s") \
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .config("spark.kryoserializer.buffer.max", "512m") \
    .config("spark.driver.maxResultSize", "2g") \
    .config("spark.sql.legacy.addSingleFileInAddFile", "false") \
    .config("spark.rdd.compress", "true") \
    .getOrCreate()


df = spark.sql("SELECT * FROM default.scraped_data")

strata_column = "code_postal"


fractions = df.select(strata_column).distinct().rdd.flatMap(lambda x: x).map(lambda x: (x, 0.1)).collectAsMap()


sampled_df = df.sampleBy(strata_column, fractions, seed=42)

columns_to_drop = [
    "identifiant_document", "reference_document", "identifiant_local",
    "article_cgi_1", "article_cgi_2", "article_cgi_3", "article_cgi_4", "article_cgi_5",
    "lot_1", "surface_lot_1", "lot_2", "surface_lot_2", "lot_3", "surface_lot_3",
    "lot_4", "surface_lot_4", "lot_5", "surface_lot_5", "nombre_lots",
    "no_voie", "btq", "type_voie", "code_voie", "voie", "code_commune",
    "prefixe_section", "section", "no_plan", "no_volume",
    "no_disposition", "commune", "code_departement", "code_type_local", "nature_culture", "nature_culture_speciale", "surface_terrain"
]



df_clean = sampled_df.drop(*columns_to_drop)

df_clean = df_clean.filter(col("nature_mutation") == "Vente")

df_clean = df_clean.filter(col("type_local").isin("Maison", "Appartement"))

df_clean = df_clean.drop("nature_mutation")



df_clean = df_clean.withColumn("date_mutation", to_date(col("date_mutation"), "dd/MM/yyyy")) \
    .withColumn("annee_mutation", year(col("date_mutation"))) \
    .withColumn("mois_mutation", month(col("date_mutation"))) \
    .withColumn("valeur_fonciere", regexp_replace(col("valeur_fonciere"), ",", ".").cast(FloatType())) \
    .withColumn("surface_reelle_bati", col("surface_reelle_bati").cast(FloatType())) \
    .withColumn("nombre_pieces_principales", col("nombre_pieces_principales").cast(IntegerType()))


df_clean = df_clean.withColumn("prix_m2", col("valeur_fonciere") / col("surface_reelle_bati"))

stats = df_clean.select("prix_m2").summary("min", "25%", "75%", "max").collect()
q1 = float(stats[1]["prix_m2"])
q3 = float(stats[2]["prix_m2"])
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

df_clean = df_clean.filter((col("prix_m2") >= lower_bound) & (col("prix_m2") <= upper_bound))



yearly_trends = df_clean.groupBy("code_postal", "type_local", "annee_mutation") \
    .agg(avg("prix_m2").alias("avg_prix_m2"), 
         count("*").alias("transaction_count"))


window_spec = Window.partitionBy("code_postal", "type_local").orderBy("annee_mutation")
yearly_trends = yearly_trends.withColumn("prev_year_price", lag("avg_prix_m2", 1).over(window_spec))
yearly_trends = yearly_trends.withColumn("yoy_growth", 
                                        when(col("prev_year_price").isNotNull(), 
                                             (col("avg_prix_m2") - col("prev_year_price")) / col("prev_year_price") * 100)
                                        .otherwise(0))


yearly_trends = yearly_trends.withColumn("growth_3y_later", 
                                        lead("avg_prix_m2", 3).over(window_spec))
yearly_trends = yearly_trends.withColumn("cagr_3y", 
                                        when(col("growth_3y_later").isNotNull(),
                                             pow(col("growth_3y_later") / col("avg_prix_m2"), 1.0/3) - 1)
                                        .otherwise(0))



df_with_trends = df_clean.join(yearly_trends.select("code_postal", "type_local", "annee_mutation", 
                                                  "avg_prix_m2", "yoy_growth", "cagr_3y"), 
                              ["code_postal", "type_local", "annee_mutation"], "left")


top_growing_regions = yearly_trends.filter(col("annee_mutation") < 2023) \
    .groupBy("code_postal") \
    .agg(avg("yoy_growth").alias("avg_growth")) \
    .orderBy(desc("avg_growth")) \
    .limit(10)
top_growing_regions_df = top_growing_regions.toPandas()

df_with_trends = df_with_trends.withColumn("below_market_price", 
                                         when(col("prix_m2") < col("avg_prix_m2") * 0.9, 1).otherwise(0))


df_with_trends = df_with_trends.withColumn("price_score", 
                                         (1 - (col("prix_m2") / col("avg_prix_m2"))) * 50)
df_with_trends = df_with_trends.withColumn("growth_score", 
                                         when(col("yoy_growth") > 0, col("yoy_growth") * 5).otherwise(0))
df_with_trends = df_with_trends.withColumn("opportunity_score", 
                                         col("price_score") + col("growth_score"))


df_with_trends = df_with_trends.withColumn("is_good_opportunity", 
                                         when(col("opportunity_score") > 20, 1).otherwise(0))



train_data = df_with_trends.filter(col("annee_mutation").between(2019, 2022))
test_data = df_with_trends.filter(col("annee_mutation").between(2023, 2024))


print("Training data count:", train_data.count())
print("Testing data count:", test_data.count())
print("Good opportunities in training:", train_data.filter(col("is_good_opportunity") == 1).count())
print("Good opportunities in testing:", test_data.filter(col("is_good_opportunity") == 1).count())


categorical_cols = ["type_local", "code_postal"]
numerical_cols = ["surface_reelle_bati", "nombre_pieces_principales", "prix_m2", "avg_prix_m2", "yoy_growth"]


def replace_empty_strings(dataframe, columns):
    for col_name in columns:
        dataframe = dataframe.withColumn(
            col_name, when(col(col_name) == "", None).otherwise(col(col_name))
        )
    return dataframe

df_with_trends = replace_empty_strings(df_with_trends, categorical_cols)
train_data = replace_empty_strings(train_data, categorical_cols)
test_data = replace_empty_strings(test_data, categorical_cols)


imputer = Imputer(inputCols=numerical_cols, outputCols=numerical_cols).setStrategy("mean")


stages = []
for cat_col in categorical_cols:
    indexer = StringIndexer(inputCol=cat_col, outputCol=f"{cat_col}_indexed", handleInvalid="keep")
    stages.append(indexer)


assembler = VectorAssembler(
    inputCols=[f"{col}_indexed" for col in categorical_cols] + numerical_cols,
    outputCol="features",
    handleInvalid="skip"
)
stages.append(assembler)


scaler = StandardScaler(inputCol="features", outputCol="scaled_features", withStd=True, withMean=True)
stages.append(scaler)


rf = RandomForestClassifier(
    labelCol="is_good_opportunity",
    featuresCol="scaled_features",
    numTrees=20,  
    maxDepth=6,  
    seed=42,
    cacheNodeIds=True,
    maxBins=16  
)
stages.append(rf)


pipeline = Pipeline(stages=[imputer] + stages)


train_data = train_data.cache()


model = pipeline.fit(train_data)


predictions = model.transform(test_data)


evaluator = BinaryClassificationEvaluator(labelCol="is_good_opportunity", metricName="areaUnderROC")
auc = evaluator.evaluate(predictions)
print(f"Area under ROC: {auc}")

evaluator_acc = MulticlassClassificationEvaluator(labelCol="is_good_opportunity", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator_acc.evaluate(predictions)
print(f"Accuracy: {accuracy}")


def analyze_region_trends(code_postal, property_type=None):
    """
    Analyze historical price trends for a specific postal code
    
    Parameters:
    code_postal: The postal code to analyze
    property_type: Optional filter for property type
    
    Returns:
    Pandas DataFrame with yearly trends
    """
    filter_query = col("code_postal") == code_postal
    if property_type:
        filter_query = filter_query & (col("type_local") == property_type)
    
    region_data = df_clean.filter(filter_query)
    
    
    yearly_trends = region_data.groupBy("annee_mutation") \
        .agg(avg("prix_m2").alias("avg_prix_m2"),
             count("*").alias("transaction_count"))
    
    
    yearly_pd = yearly_trends.toPandas().sort_values("annee_mutation")
    yearly_pd["yoy_growth"] = yearly_pd["avg_prix_m2"].pct_change() * 100
    
    return yearly_pd



def classify_listing_with_trends(item_df):
    """
    Classify scraped listings to identify good opportunities with trend analysis
    
    Parameters:
    item_df: A Spark DataFrame with columns: type_bien, surface, prix, code_postal, nombre_pieces
    
    Returns:
    DataFrame with predictions and investment metrics
    """
    
    processed_df = item_df.withColumnRenamed("type_bien", "type_local") \
                          .withColumnRenamed("surface", "surface_reelle_bati") \
                          .withColumnRenamed("prix", "valeur_fonciere")
    
    
    if "nombre_pieces" in item_df.columns:
        processed_df = processed_df.withColumnRenamed("nombre_pieces", "nombre_pieces_principales")
    
    elif "nombre_pieces_principales" not in processed_df.columns:
        
        processed_df = processed_df.withColumn("nombre_pieces_principales", 
                                              (col("surface_reelle_bati") / 25).cast(IntegerType()))
    
    
    processed_df = processed_df.withColumn("prix_m2", 
                                          col("valeur_fonciere") / col("surface_reelle_bati"))
    
    
    current_year = 2025 
    
    
    processed_with_trends = processed_df.join(
        yearly_trends.filter(col("annee_mutation") == current_year - 1)
            .select("code_postal", "type_local", "avg_prix_m2", "yoy_growth", "cagr_3y"),
        ["code_postal", "type_local"],
        "left"
    )
    
    
    processed_with_trends = processed_with_trends.na.fill({
        "avg_prix_m2": 0, 
        "yoy_growth": 0, 
        "cagr_3y": 0
    })
    
    
    processed_with_trends = processed_with_trends.withColumn(
        "price_discount", 
        when(col("avg_prix_m2") > 0, 
             (1 - (col("prix_m2") / col("avg_prix_m2"))) * 100).otherwise(0)
    )
    
    processed_with_trends = processed_with_trends.withColumn(
            "potential_5y_growth",
            when(
                col("cagr_3y") > 0,
                
                (pow(1 + col("cagr_3y"), 5) - 1) * 100)
            .otherwise(
                
                col("yoy_growth") * (1 + 0.8 + 0.6 + 0.4 + 0.2)
                )
            )
    processed_with_trends = processed_with_trends.withColumn(
            "potential_5y_growth",
            when(col("potential_5y_growth") > 100, 100)  
            .when(col("potential_5y_growth") < -50, -50)  
            .otherwise(col("potential_5y_growth"))
    ) 
    
    predictions = model.transform(processed_with_trends)
    
    
    return predictions.select(
        "url",
        "titre",
        "type_local", 
        "surface_reelle_bati", 
        "nombre_pieces_principales",
        "valeur_fonciere", 
        "code_postal", 
        "prix_m2",
        round(col("avg_prix_m2"), 2).alias("avg_market_price_m2"),
        round(col("price_discount"), 1).alias("price_discount_pct"),
        round(col("yoy_growth"), 1).alias("yoy_growth_pct"),
        round(col("potential_5y_growth"), 1).alias("potential_5y_growth_pct"),
        "prediction"
    )

def generate_and_store_stats():
    """
    Generate useful statistics for frontend visualization and store them in MongoDB
    """
    stats_collection = db["stats"] 
    stats_collection.delete_many({})
    
    national_trends = df_clean.groupBy("annee_mutation", "type_local") \
        .agg(avg("prix_m2").alias("avg_price"),
             count("*").alias("transaction_count"))
    
    national_trends_df = national_trends.toPandas()
    stats_collection.insert_one({
        "stat_type": "national_price_trends",
        "data": national_trends_df.to_dict(orient="records"),
        "updated_at": pd.Timestamp.now()
    })
    
    
    regional_prices = df_clean.filter(col("annee_mutation") == 2024) \
        .groupBy("code_postal") \
        .agg(avg("prix_m2").alias("avg_price"),
             count("*").alias("transaction_count"))
    
    regional_prices_df = regional_prices.toPandas()
    stats_collection.insert_one({
        "stat_type": "regional_price_distribution",
        "data": regional_prices_df.to_dict(orient="records"),
        "updated_at": pd.Timestamp.now()
    })
    
    
    property_type_data = df_clean.groupBy("type_local") \
        .count() \
        .withColumnRenamed("count", "property_count")
    
    property_type_df = property_type_data.toPandas()
    stats_collection.insert_one({
        "stat_type": "property_type_distribution",
        "data": property_type_df.to_dict(orient="records"),
        "updated_at": pd.Timestamp.now()
    })
    
    
    opportunity_scores = df_with_trends.select("code_postal", "opportunity_score") \
        .filter(col("opportunity_score").isNotNull()) \
        .groupBy("code_postal") \
        .agg(avg("opportunity_score").alias("avg_opportunity_score"),
             count("*").alias("property_count")) \
        .orderBy(desc("avg_opportunity_score"))
    
    opportunity_scores_df = opportunity_scores.toPandas()
    stats_collection.insert_one({
        "stat_type": "investment_opportunity_scores",
        "data": opportunity_scores_df.to_dict(orient="records"),
        "updated_at": pd.Timestamp.now()
    })
    
    print("Statistics successfully stored in MongoDB.")



client = MongoClient("mongodb://localhost:27017/")  # Change this if needed
db = client["lebon_spider"]
collection = db["Immobiliers"]
predictions = db["predictions"]
stats_collection = db["stats"]
listings = list(collection.find({}, {"_id": 0}))
if not listings:
    print("No listing")
from pyspark.sql.functions import monotonically_increasing_id

listings_df = pd.DataFrame(listings)

listings_df['unique_id'] = range(len(listings_df)) 

spark_df = spark.createDataFrame(listings_df)

spark_df = spark_df.withColumn("unique_id", monotonically_increasing_id())

classified_results = classify_listing_with_trends(spark_df)
filtered_results = classified_results.filter(
        (classified_results.prediction == 1.0) & 
        (classified_results.potential_5y_growth_pct <= 40)
        )
filtered_results.show()
filtered_df = filtered_results.toPandas()


collection = db["predictions"]
generate_and_store_stats()
stats_collection.insert_one({
        "stat_type": "top_growing_regions",
        "data": top_growing_regions_df.to_dict(orient="records"),
        "updated_at": pd.Timestamp.now()
    })

collection.insert_many(filtered_df.to_dict(orient="records"))

print("Filtered predictions successfully inserted into MongoDB.")




spark.stop()
