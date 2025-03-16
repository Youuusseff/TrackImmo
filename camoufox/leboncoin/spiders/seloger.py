import scrapy
import time
from leboncoin.items import Immobilier
from scrapy_camoufox.page import PageMethod
import random

class SelogerSpider(scrapy.Spider):
    name = "seloger"
    allowed_domains = ["seloger.com"]
    url = "https://www.seloger.com"

    def start_requests(self):
        """Scrapy entry point: Fetch page via Playwright and pass it to Scrapy."""
        yield scrapy.Request(
                url = self.url,
                meta={
                    "camoufox": True,
                    "camoufox_include_page": True,
                    "camoufox_page_methods":[
                        PageMethod("wait_for_timeout", timeout= 5000),
                        PageMethod("wait_for_selector", selector='button[id="didomi-notice-agree-button"]'),
                        PageMethod("wait_for_timeout", timeout=4200),
                        PageMethod("click", selector='button[id="didomi-notice-agree-button"]'),
                        PageMethod("wait_for_timeout", timeout=10000),
                        PageMethod("wait_for_selector", selector='button[data-testid="shell_ufrn_header-NavigationBar-NavigationBarL1EntryExpandable[0]-NavigationBarL1EntryButton"]'),
                        PageMethod("click", selector='button[data-testid="shell_ufrn_header-NavigationBar-NavigationBarL1EntryExpandable[0]-NavigationBarL1EntryButton"]'),
                        PageMethod("wait_for_timeout", timeout=2000),
                        PageMethod("wait_for_selector", selector='a[data-testid="shell_ufrn_header-NavigationBar-NavigationBarL1EntryExpandable[0]-DropdownMenu-DropdownHeaderEntries-DropdownHeaderL2Entry[0]-DropdownHeaderL3Entry[0]"]'),
                        PageMethod("click", selector='a[data-testid="shell_ufrn_header-NavigationBar-NavigationBarL1EntryExpandable[0]-DropdownMenu-DropdownHeaderEntries-DropdownHeaderL2Entry[0]-DropdownHeaderL3Entry[0]"]'),
                        PageMethod("wait_for_timeout", timeout= random.randint(5000,6500)),
                        PageMethod("wait_for_selector", selector='button[type="submit"]'),
                        PageMethod("wait_for_timeout", timeout=random.randint(4200,5000)),
                        PageMethod("click", selector='button[type="submit"]'),
                        PageMethod("wait_for_timeout", timeout=10000),
                        PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight)"),
                    ],# Ensures the Playwright page is passed
                    "camoufox_context_kwargs": {
                        "ignore_https_errors": True,
                        },
                    },
                callback = self.parse,
            )
    def goto_data(self, response):
        yield scrapy.Request(
                url = self.url,
                meta={
                    "camoufox": True,
                    "camoufox_include_page": True,
                    "camoufox_page_methods":[
                        PageMethod("wait_for_timeout", timeout= random.randint(5000,6500)),
                        PageMethod("wait_for_selector", selector='button[type="submit"]'),
                        PageMethod("wait_for_timeout", timeout=random.randint(4200,5000)),
                        PageMethod("click", selector='button[type="submit"]'),
                    ],# Ensures the Playwright page is passed
                    "camoufox_context_kwargs": {
                        "ignore_https_errors": True,
                        },
                    },
                callback = self.parse,
            )
    def parse(self, response):
        print("Im innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
        """Extracts ad links from the main page and follows them."""
        ad_links = response.css('a[title="Seloger"]::attr(href)').getall()
        for link in ad_links:
            time.sleep(2)
            full_link = response.urljoin(link)
            yield scrapy.Request(
                full_link,
                meta={"camoufox": True},
                callback=self.parse_ad_description
            )
            time.sleep(2)
            yield scrapy.Request(
                    response.url,
                    meta={
                        "camoufox": True,
                        "camoufox_page_methods":{
                            "click": PageMethod("click", selector = 'a[data-testid="gsl.uilib.Paging.nextButton"]')
                            },
                        },
                
                    callback=self.parse
                    )

    def parse_ad_description(self, response):
        if "boutique" in response.url:
            return
        time.sleep(3)
        """Extracts data from the ad's detailed page."""
        titre = response.css("div.Summarystyled__Title-sc-1u9xobv-4::text").get().strip()
        prix = response.css('span.Summarystyled__PriceText-sc-1u9xobv-8 > span::text').get()
        surface = response.css('div.Summarystyled__TagsWrapper-sc-1u9xobv-14  div:nth-child(3)::text').get()

        yield Immobilier(
            Url=response.url,
            Titre=titre,
            Surface=surface,
            Prix=prix,)

