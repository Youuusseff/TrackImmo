# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import pymongo
import unicodedata
# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import re
import logging
class LeboncoinPipeline:
    def process_item(self, item, spider):
        logging.info(f"Processing item: {item}")
        if ( "boutique" in item['url']):
            raise DropItem()
        if item["code_postal"]:
            item["code_postal"] = item["code_postal"].replace("\xa0", " ")
            item["code_postal"] = extract_postal_code(item["code_postal"])
        if item["prix"]:
            item["prix"] = unicodedata.normalize("NFKC", item["prix"]).replace("\u202f", "").replace("\xa0", "").replace("€", "").strip()
            item['prix'] = int(item['prix'].replace(" ", ""))
        if item["surface"]:
            item["surface"] = item["surface"].replace("\xa0", " ").strip()
            item['surface'] = int(re.sub(r'\s*m²', '', item['surface']))
        if item["titre"]:
            item["titre"] = item["titre"].replace("\xa0", " ").strip()
        if item['nombre_pieces']:
            item['nombre_pieces'] = int(re.sub(r'\s*pièce?s?', '', item['nombre_pieces']))
        return item

class MongoDBPipeline:

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE')
        )

    def open_spider(self, spider):
        # Connexion à MongoDB lors de l'ouverture du spider
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        # Fermeture de la connexion à MongoDB après l'exécution du spider
        self.client.close()

    def process_item(self, item, spider):
        # Insertion de l'item dans une collection MongoDB
        self.db["Immobiliers"].insert_one(dict(item))  # spider.name = nom de la collection
        return item

def extract_postal_code(location: str) -> str:
    match = re.search(r'\b\d{5}\b', location)
    return match.group() if match else None
