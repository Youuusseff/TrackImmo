# Scrapy settings for leboncoin project
from browserforge.fingerprints import Screen
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = "leboncoin"

SPIDER_MODULES = ["leboncoin.spiders"]
NEWSPIDER_MODULE = "leboncoin.spiders"

# settings.py

# Set the proxy globally for Scrapy requests

# Set the proxy in the middleware

# Use the proxy for all requests

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "leboncoin (+http://www.yourdomain.com)"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False
# settings.py
DOWNLOAD_HANDLERS = {
    "http": "scrapy_camoufox.handler.ScrapyCamoufoxDownloadHandler",
    "https": "scrapy_camoufox.handler.ScrapyCamoufoxDownloadHandler",

}
CAMOUFOX_DEFAULT_NAVIGATION_TIMEOUT = 1200 * 1000  # 10 seconds
# settings.py
CAMOUFOX_MAX_PAGES_PER_CONTEXT = 1
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
PLAYWRIGHT_LAUNCH_OPTIONS = {
    # Humanize the cursor movement. Takes either True, or the MAX duration in seconds of the cursor movement.
    "humanize": True,
    # Defaults to False. If you are running linux, passing 'virtual' will use Xvfb.
    "headless": True,
    "os": ["macos"],
    # Fonts to load into Camoufox, in addition to the default fonts for the target os
    "fonts": ["Arial", "Helvetica", "Times New Roman"],
    "geoip": True,
    # Constrains the screen dimensions of the generated fingerprint.
    # from browserforge.fingerprints import Screen
    "screen": Screen(max_width=1920, max_height=1080),
    # Use a specific WebGL vendor/renderer pair. Passed as a tuple of (vendor, renderer). The vendor & renderer combination must be supported for the target os or this will cause leaks.
    "webgl_config": ("Apple", "Apple M1, or similar"),
    # List of Firefox addons to use. Must be paths to extracted addons.
    "addons": ["/home/zbib/PFE/camoufox/leboncoin/addons/addon1", "/home/zbib/PFE/camoufox/leboncoin/addons/addon2"],
    # Set the window size in (width, height) pixels. This will also set the window.screenX and window.screenY properties to position the window at the center of the generated screen.
    "window": (1282, 955),
    # Whether to cache previous pages, requests, etc. Disabled by default as it uses more memory.
    "enable_cache": True,
    # persistent context
    "persistent_context": True,
    "user_data_dir": '/home/zbib/PFE/camoufox/leboncoin/data',
}
# Configure maximum concurrent requests performed by Scrapy (default: 16)
#CONCURRENT_REQUESTS = 32
MONGO_URI = 'mongodb://localhost:27017'
MONGO_DATABASE = 'lebon_spider'
# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
CONCURRENT_REQUESTS_PER_IP = 10

# Disable cookies (enabled by default)
COOKIES_ENABLED = True

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#    "Accept-Language": "en",
#}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "leboncoin.middlewares.LeboncoinSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#DOWNLOADER_MIDDLEWARES = {
#    "leboncoin.middlewares.LeboncoinDownloaderMiddleware": 543,
#}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
    "leboncoin.pipelines.LeboncoinPipeline": 1,    
    "leboncoin.pipelines.MongoDBPipeline": 100,
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"
