from flask import Flask, jsonify, request
from pymongo import MongoClient
from pyspark.sql import SparkSession
import pandas as pd
import json
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)
# Connect to MongoDB
client = MongoClient("mongodb+srv://youssefbenomrane45:FUrzdYUls9XAQNnB@cluster0.awpxajp.mongodb.net")  # Change this if needed
db = client["lebon_spider"]  # Change to your database name
collection = db["predictions"]  # Change to your collection name
stats_collection = db["stats"]


@app.route('/get', methods=['GET'])
def get_filtered_listings():
    query = {}
    city = request.args.get('city')
    type_local = request.args.get('type_local')
    rooms = request.args.get('rooms', type=int)
    price_min = request.args.get('price_min', type=int)
    price_max = request.args.get('price_max', type=int)
    limit = request.args.get('limit', default=50, type=int)
    skip = request.args.get('skip', default=0, type=int)

    if city:
        query['code_postal'] = {"$regex": f"^{city}"}
    if type_local:
        query['type_local'] = type_local
    if rooms is not None:
        query['nombre_pieces_principales'] = {"$gte": rooms}
    if price_min is not None:
        query['valeur_fonciere'] = query.get('valeur_fonciere', {})
        query['valeur_fonciere']['$gte'] = price_min
    if price_max is not None:
        query['valeur_fonciere'] = query.get('valeur_fonciere', {})
        query['valeur_fonciere']['$lte'] = price_max

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

