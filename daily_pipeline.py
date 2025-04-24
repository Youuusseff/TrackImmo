from pymongo import MongoClient
import subprocess
import time

# === 1. Delete MongoDB Collections ===
def clear_collections():
    print("Clearing MongoDB collections...")
    client = MongoClient("your_mongodb_atlas_connection_string")
    db = client["lebon_spider"]
    db["predictions"].delete_many({})
    db["immobilier"].delete_many({})
    print("Collections cleared.")

# === 2. Run Scrapy Spider ===
def run_scrapy():
    print("Running Scrapy spider...")
    subprocess.run(["scrapy", "crawl", "lebon"], cwd="/path/to/your/spider/folder")  # Adjust path and spider name
    print("Scraping done.")

# === 3. Run ML Prediction Code ===
def run_ml_code():
    print("Running ML prediction script...")
    subprocess.run(["python", "predict.py"], cwd="/path/to/your/ml/code")  # Adjust path to your prediction script
    print("Prediction complete.")

if __name__ == "__main__":
    clear_collections()
    time.sleep(5)
    run_scrapy()
    time.sleep(5)
    run_ml_code()
