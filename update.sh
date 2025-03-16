#!/bin/bash

# Check dependencies
if [[ `which xidel` == "" ]]; then echo "error: xidel must be installed"; exit 1; fi
if [[ `which curl` == "" ]]; then echo "error: curl must be installed"; exit 1; fi
if [[ `which gzip` == "" ]]; then echo "error: gzip must be installed"; exit 1; fi
if [[ `which hadoop` == "" ]]; then echo "error: Hadoop must be installed"; exit 1; fi

# Set paths
HDFS_DIR="/user/hdoop/dvf_data"
RAW_HDFS_DIR="/user/hdoop/dvf_data_raw"
LOCAL_DIR="./scraped_files"
TEMP_DIR="./temp_files"

# Create local directories for storing downloaded files
mkdir -p $LOCAL_DIR
mkdir -p $TEMP_DIR

# Open the DVF page, look for anything that looks like a dataset in the "resources" section and download it.
echo "Downloading files..."
xidel --silent https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/ -e '//a[contains(@href, "https://static.data.gouv.fr/resources/")]' | \
  uniq | \
  sed '/^$/d' | \
  grep '/valeur' | \
  xargs -i{} curl --silent --show-error -w "Download of %{url} finished\n" -OL {}

# Decompress any zip files to temp directory
echo "Decompressing files..."
for zipfile in *.zip; do
  if [ -f "$zipfile" ]; then
    unzip -o "$zipfile" -d $TEMP_DIR
  fi
done
rm -f *.zip

# Create HDFS directories
echo "Creating HDFS directories..."
hadoop fs -mkdir -p $HDFS_DIR
hadoop fs -mkdir -p $RAW_HDFS_DIR

# Process and upload raw files to HDFS first
echo "Processing and uploading raw files to HDFS..."
for file in $TEMP_DIR/*.txt; do
  if [ -f "$file" ]; then
    # Upload uncompressed file to raw HDFS directory
    hadoop fs -put -f "$file" $RAW_HDFS_DIR/
  fi
done

# Compress files for archive
echo "Compressing files for archive..."
find $TEMP_DIR -name "*.txt" -o -name "*.pdf" | xargs gzip -n --force --best
mv $TEMP_DIR/*.gz $LOCAL_DIR/

# Upload compressed files to HDFS
echo "Uploading compressed files to HDFS..."
hadoop fs -put -f $LOCAL_DIR/*.gz $HDFS_DIR

# Create a raw table first for correct data loading
echo "Creating raw Hive table..."
beeline -u jdbc:hive2://localhost:10000 -n hdoop -e "
DROP TABLE IF EXISTS scraped_data_raw;
CREATE EXTERNAL TABLE IF NOT EXISTS scraped_data_raw (
  col1 STRING, col2 STRING, col3 STRING, col4 STRING, col5 STRING,
  col6 STRING, col7 STRING, col8 STRING, col9 STRING, col10 STRING,
  col11 STRING, col12 STRING, col13 STRING, col14 STRING, col15 STRING,
  col16 STRING, col17 STRING, col18 STRING, col19 STRING, col20 STRING,
  col21 STRING, col22 STRING, col23 STRING, col24 STRING, col25 STRING,
  col26 STRING, col27 STRING, col28 STRING, col29 STRING, col30 STRING,
  col31 STRING, col32 STRING, col33 STRING, col34 STRING, col35 STRING,
  col36 STRING, col37 STRING, col38 STRING, col39 STRING, col40 STRING,
  col41 STRING, col42 STRING, col43 STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n'
STORED AS TEXTFILE
LOCATION '$RAW_HDFS_DIR'
TBLPROPERTIES ('skip.header.line.count'='1');"

# Create the final table with proper column names and types
echo "Creating final Hive table..."
beeline -u jdbc:hive2://localhost:10000 -n hdoop -e "
DROP TABLE IF EXISTS scraped_data;
CREATE TABLE scraped_data AS
SELECT
  col1 AS identifiant_document,
  col2 AS reference_document,
  col3 AS article_cgi_1,
  col4 AS article_cgi_2,
  col5 AS article_cgi_3,
  col6 AS article_cgi_4,
  col7 AS article_cgi_5,
  col8 AS no_disposition,
  col9 AS date_mutation,
  col10 AS nature_mutation,
  col11 AS valeur_fonciere,
  col12 AS no_voie,
  col13 AS btq,
  col14 AS type_voie,
  col15 AS code_voie,
  col16 AS voie,
  col17 AS code_postal,
  col18 AS commune,
  col19 AS code_departement,
  col20 AS code_commune,
  col21 AS prefixe_section,
  col22 AS section,
  col23 AS no_plan,
  col24 AS no_volume,
  col25 AS lot_1,
  CAST(CASE WHEN col26 = '' THEN NULL ELSE col26 END AS DECIMAL(18,2)) AS surface_lot_1,
  col27 AS lot_2,
  CAST(CASE WHEN col28 = '' THEN NULL ELSE col28 END AS DECIMAL(18,2)) AS surface_lot_2,
  col29 AS lot_3,
  CAST(CASE WHEN col30 = '' THEN NULL ELSE col30 END AS DECIMAL(18,2)) AS surface_lot_3,
  col31 AS lot_4,
  CAST(CASE WHEN col32 = '' THEN NULL ELSE col32 END AS DECIMAL(18,2)) AS surface_lot_4,
  col33 AS lot_5,
  CAST(CASE WHEN col34 = '' THEN NULL ELSE col34 END AS DECIMAL(18,2)) AS surface_lot_5,
  CAST(CASE WHEN col35 = '' THEN NULL ELSE col35 END AS INT) AS nombre_lots,
  col36 AS code_type_local,
  col37 AS type_local,
  col38 AS identifiant_local,
  col39 AS surface_reelle_bati,
  col40 AS nombre_pieces_principales,
  col41 AS nature_culture,
  col42 AS nature_culture_speciale,
  col43 AS surface_terrain
FROM scraped_data_raw;"

# Verify the data loaded correctly
echo "Verifying data load..."
beeline -u jdbc:hive2://localhost:10000 -n hdoop -e "
SELECT date_mutation, nature_mutation, valeur_fonciere, commune, type_local
FROM scraped_data
LIMIT 10;"

echo "Process completed."
