import scrapy
import time
from leboncoin.items import Immobilier
from scrapy_camoufox.page import PageMethod
import re

class BieniciSpider(scrapy.Spider):
    name = "bienici"
    allowed_domains = ["bienici.com"]
    url = "https://bienici.com/recherche/achat/france"
    page_count = 1

    def start_requests(self):
        """Scrapy entry point: Fetch page via Playwright and pass it to Scrapy."""
        yield scrapy.Request(
                url = self.url,
                meta={
                    "camoufox": True,
                    "playwright_include_page": True,  # Ensures the Playwright page is passed
                    "camoufox_context": "awesome_context",
                    "camoufox_page_methods":[
                        PageMethod("wait_for_load_state", "networkidle"),
                        PageMethod("wait_for_timeout", 50000)],
                    "camoufox_context_kwargs": {
                        "ignore_https_errors": True,
                        },
                    },
                callback = self.parse,
                )

    def parse(self, response):
        self.page_count += 1
        ad_links = response.css('a[class="detailedSheetLink"]')
        for ad_link in ad_links:
            titre = ad_link.css('span.ad-overview-details__ad-title--small::text').get()
            adresse = ad_link.css('span.ad-overview-details__address-title--small::text').get()
            prix = ad_link.css('span.ad-price__the-price::text').get()
            link = ad_link.css('a::attr(href)').get()
            match = re.search(r"(\d+)\s*m²$", titre)
            surface = match.group(1) + "m²" if match else None
            match = re.search(r"(\d+)\s*pièce?s?", titre, re.IGNORECASE)
            nombre_pieces = match.group(1) if match else None
            type_bien = "Appartement" if "appartement" in titre.lower() else "Maison" if "maison" in titre.lower() else None
            yield Immobilier(
                url=response.urljoin(link),
                titre=titre,
                prix=prix,
                surface=surface,
                code_postal=adresse,
                nombre_pieces=nombre_pieces,
                type_bien= type_bien
                )
        if (self.page_count <= 5):
            next_page = self.url.rstrip("/") + f"?page={self.page_count}"
            # Handle Pagination
            if next_page:
                time.sleep(2)
                yield scrapy.Request(
                    response.urljoin(next_page),
                    meta={
                    "camoufox": True,
                    "playwright_include_page": True,  # Ensures the Playwright page is passed
                    "camoufox_context": "awesome_context",
                    "camoufox_page_methods":[
                        PageMethod("wait_for_load_state", "networkidle"),
                        PageMethod("wait_for_timeout", timeout=50000),],
                    "camoufox_context_kwargs": {
                        "ignore_https_errors": True,
                        },
                    },
                callback = self.parse,
                )
