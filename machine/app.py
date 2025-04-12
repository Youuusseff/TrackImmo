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
stats_collection = db["stats"]


@app.route('/get', methods=['GET'])
def get_filtered_listings():
    """Filter by price, location, surface, and paginate"""
    query = {}
    price_min = request.args.get('price_min', type=int)
    price_max = request.args.get('price_max', type=int)
    city = request.args.get('city')
    limit = request.args.get('limit', default=20, type=int)
    skip = request.args.get('skip', default=0, type=int)

    if price_min is not None:
        query['price'] = query.get('price', {})
        query['price']['$gte'] = price_min
    if price_max is not None:
        query['price'] = query.get('price', {})
        query['price']['$lte'] = price_max
    if city:
        query['city'] = city

    listings = list(collection.find(query, {"_id": 0}).skip(skip).limit(limit))
    return jsonify(listings)
@app.route("/getall", methods=["GET"])
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

@app.route('/api/stats/<stat_type>', methods=['GET'])
def get_stats(stat_type):
    """Get statistics by type"""
    stats = stats_collection.find_one({"stat_type": stat_type}, {"_id": 0})
    if stats:
        return jsonify(stats)
    return jsonify({"error": "Statistics not found"}), 404

@app.route('/api/stats', methods=['GET'])
def get_all_stats():
    """Get all available statistics"""
    stats = list(stats_collection.find({}, {"_id": 0}))
    return jsonify(stats)

@app.route('/get/<string:listing_id>', methods=['GET'])
def get_listing_detail(listing_id):
    """Fetch a single listing by its unique ID (e.g., URL, title hash, or _id if exposed)"""
    listing = collection.find_one({"id": listing_id}, {"_id": 0})
    if listing:
        return jsonify(listing)
    return jsonify({"error": "Listing not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)

