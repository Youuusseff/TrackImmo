from flask import Flask, jsonify
from pymongo import MongoClient
from pyspark.sql import SparkSession
import pandas as pd
import json

# Initialize Flask app
app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Change this if needed
db = client["lebon_spider"]  # Change to your database name
collection = db["predictions"]  # Change to your collection name



@app.route("/predict", methods=["GET"])
def predict():
    try:
        # Fetch data from MongoDB
        listings = list(collection.find({}, {"_id": 0}))  # Exclude `_id` field

        if not listings:
            return jsonify({"error": "No listings found in MongoDB"})

        # Convert MongoDB data to a Pandas DataFrame
        return jsonify(listings)

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)

