# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class Immobilier(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    url = scrapy.Field()
    titre = scrapy.Field()
    prix = scrapy.Field()
    surface = scrapy.Field()
    code_postal = scrapy.Field()
    type_bien = scrapy.Field()
    nombre_pieces = scrapy.Field()
