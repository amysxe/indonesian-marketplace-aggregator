import json
import urllib.parse
import time
import uuid

# Define the data structure for a product
class MockScraper:
    def __init__(self):
        # A simple mock database of products for demonstration
        self.products = [
            {"product_id": str(uuid.uuid4()), "source": "Tokopedia", "name": "Keyboard Gaming Mekanik Gateron Pro", "price": 850000, "seller": "TokoTech", "url": "https://example.com/tokped/a", "imageUrl": "https://placehold.co/400x400/22c55e/ffffff?text=Tokped+A"},
            {"product_id": str(uuid.uuid4()), "source": "Shopee", "name": "Mouse Gaming Nirkabel RGB", "price": 425000, "seller": "GadgetGrosir", "url": "https://example.com/shopee/b", "imageUrl": "https://placehold.co/400x400/ef4444/ffffff?text=Shopee+B"},
            {"product_id": str(uuid.uuid4()), "source": "Bukalapak", "name": "Headset Bluetooth Bass", "price": 600000, "seller": "ElektronikPintar", "url": "https://example.com/bukalapak/c", "imageUrl": "https://placehold.co/400x400/3b82f6/ffffff?text=Bukalapak+C"},
            {"product_id": str(uuid.uuid4()), "source": "Lazada", "name": "Keyboard Gaming Logitech G Pro", "price": 1100000, "seller": "TokoTech", "url": "https://example.com/lazada/z", "imageUrl": "https://placehold.co/400x400/f97316/ffffff?text=Lazada+Z"},
            {"product_id": str(uuid.uuid4()), "source": "Tokopedia", "name": "Mouse Gaming Nirkabel Ringan", "price": 400000, "seller": "GadgetGrosir", "url": "https://example.com/tokped/y", "imageUrl": "https://placehold.co/400x400/8b5cf6/ffffff?text=Tokped+Y"},
            {"product_id": str(uuid.uuid4()), "source": "Shopee", "name": "Mouse Gaming Logitech G502 Hero", "price": 450000, "seller": "ElektronikPintar", "url": "https://example.com/shopee/z", "imageUrl": "https://placehold.co/400x400/6b7280/ffffff?text=Shopee+Z"},
            {"product_id": str(uuid.uuid4()), "source": "Bukalapak", "name": "Earphone TWS Pro", "price": 300000, "seller": "TokoAudio", "url": "https://example.com/bukalapak/d", "imageUrl": "https://placehold.co/400x400/a3e635/000000?text=Buka+D", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Lazada", "name": "Laptop Gaming ASUS ROG", "price": 18000000, "seller": "SuperKomputer", "url": "https://example.com/lazada/e", "imageUrl": "https://placehold.co/400x400/c084fc/ffffff?text=Lazada+E", "timestamp": int(time.time())},
        ]

    def search_products(self, query):
        """
        Filters products based on a search query.
        Returns a list of products that match the query in their name.
        """
        if not query:
            return self.products[:6]

        query = query.lower()
        results = [
            p for p in self.products
            if query in p["name"].lower()
        ]
        
        # Add a date scraped to each product
        for p in results:
            p["dateScraped"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

        # Limit the results to a maximum of 6
        return results[:6]

# The handler function that Vercel will call
def handler(request):
    """
    Handles a Vercel serverless function request.
    This function is structured to be compatible with Vercel's
    serverless function environment.
    """
    # Parse the query parameters from the request URL
    url_parts = urllib.parse.urlparse(request.url)
    query_params = urllib.parse.parse_qs(url_parts.query)

    query_term = query_params.get('q', [''])[0]

    # Use the scraper to get the products based on the query term
    scraper = MockScraper()
    products = scraper.search_products(query_term)
    
    # Return a response object with the status code and JSON body
    return {
        'statusCode': 200,
        'headers': {'Content-type': 'application/json'},
        'body': json.dumps(products)
    }
