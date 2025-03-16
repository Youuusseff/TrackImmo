import scrapy
import time
from leboncoin.items import Immobilier
from scrapy_camoufox.page import PageMethod

class CamouSpider(scrapy.Spider):
    name = "camou"
    allowed_domains = ["leboncoin.fr"]
    url = "https://leboncoin.fr/c/ventes_immobilieres"
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
                        PageMethod("wait_for_load_state", "networkidle"),  # Wait for AJAX requests
                        PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight)"),  # Scroll down once
                        PageMethod("wait_for_timeout", 2000)],
                    "camoufox_context_kwargs": {
                        "ignore_https_errors": True,
                        },
                    },
                callback = self.parse,
                )

    def parse(self, response):
        time.sleep(5)
        self.page_count += 1
        """Extracts ad links from the main page and follows them."""
        ad_links = response.css('article[data-qa-id="aditem_container"] a::attr(href)').getall()
        for link in ad_links:
            time.sleep(2)
            full_link = response.urljoin(link)
            yield scrapy.Request(
                full_link,
                meta={"camoufox": True},
                callback=self.parse_ad_description
            )
        if (self.page_count <= 5):
            next_page = self.url.rstrip("/") + f"/p-{self.page_count}"
            # Handle Pagination
            if next_page:
                time.sleep(2)
                yield scrapy.Request(
                    response.urljoin(next_page),
                    meta={"camoufox": True},
                    callback=self.parse
                    )

    def parse_ad_description(self, response):
        if "boutique" in response.url:
            return 
        time.sleep(3)
        """Extracts data from the ad's detailed page."""
        titre = response.css("h1::text").get().strip() if response.css("h1::text") else None
        prix = response.css('div[data-qa-id="adview_price"] p::text').get()
        adresse = response.css('div[data-qa-id="adview_spotlight_description_container"] a::text').get()
        surface = response.css('div[data-qa-id="criteria_item_square"] p.font-bold::text').get()
        type_bien = response.css('div[data-qa-id="criteria_item_real_estate_type"] p.font-bold::text').get()
        nombre_pieces = response.css('div[data-qa-id="criteria_item_rooms"] p.font-bold::text').get()

        yield Immobilier(
            url=response.url,
            titre=titre,
            prix=prix,
            code_postal=adresse,
            surface=surface,
            nombre_pieces=nombre_pieces,
            type_bien=type_bien
        )
