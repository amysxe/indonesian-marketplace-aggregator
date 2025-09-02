# This is a backend API for scraping product data from mock marketplaces.
# It is designed to work with the React frontend created previously.
# NOTE: This is a simulation and does not scrape real websites.
# In a real-world scenario, you would use libraries like BeautifulSoup and requests
# to parse HTML from actual marketplace websites.

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import urllib.parse
import time
import uuid

class MockScraper:
    def __init__(self):
        # A simple mock database of products for demonstration
        self.products = [
            {"product_id": str(uuid.uuid4()), "source": "Tokopedia", "name": "Keyboard Gaming Mekanik Gateron Pro", "price": 850000, "seller": "TokoTech", "url": "https://example.com/tokped/a", "imageUrl": "https://placehold.co/400x400/22c55e/ffffff?text=Tokped+A", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Shopee", "name": "Mouse Gaming Nirkabel RGB", "price": 425000, "seller": "GadgetGrosir", "url": "https://example.com/shopee/b", "imageUrl": "https://placehold.co/400x400/ef4444/ffffff?text=Shopee+B", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Bukalapak", "name": "Headset Bluetooth Bass", "price": 600000, "seller": "ElektronikPintar", "url": "https://example.com/bukalapak/c", "imageUrl": "https://placehold.co/400x400/3b82f6/ffffff?text=Bukalapak+C", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Lazada", "name": "Keyboard Gaming Logitech G Pro", "price": 1100000, "seller": "TokoTech", "url": "https://example.com/lazada/z", "imageUrl": "https://placehold.co/400x400/f97316/ffffff?text=Lazada+Z", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Tokopedia", "name": "Mouse Gaming Nirkabel Ringan", "price": 400000, "seller": "GadgetGrosir", "url": "https://example.com/tokped/y", "imageUrl": "https://placehold.co/400x400/8b5cf6/ffffff?text=Tokped+Y", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Shopee", "name": "Mouse Gaming Logitech G502 Hero", "price": 450000, "seller": "ElektronikPintar", "url": "https://example.com/shopee/z", "imageUrl": "https://placehold.co/400x400/6b7280/ffffff?text=Shopee+Z", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Bukalapak", "name": "Earphone TWS Pro", "price": 300000, "seller": "TokoAudio", "url": "https://example.com/bukalapak/d", "imageUrl": "https://placehold.co/400x400/a3e635/000000?text=Buka+D", "timestamp": int(time.time())},
            {"product_id": str(uuid.uuid4()), "source": "Lazada", "name": "Laptop Gaming ASUS ROG", "price": 18000000, "seller": "SuperKomputer", "url": "https://example.com/lazada/e", "imageUrl": "https://placehold.co/400x400/c084fc/ffffff?text=Lazada+E", "timestamp": int(time.time())},
        ]

    def search_products(self, query):
        """
        Filters products based on a search query.
        Returns a list of products that match the query in their name.
        """
        if not query:
            return self.products

        query = query.lower()
        results = [
            p for p in self.products
            if query in p["name"].lower()
        ]
        return results

class MyRequestHandler(BaseHTTPRequestHandler):
    """
    A simple HTTP request handler for the scraping API.
    """
    scraper = MockScraper()

    def do_GET(self):
        """
        Handles GET requests to the /api/scrape endpoint.
        It parses the 'q' parameter and returns filtered product data.
        """
        # Parse the URL to get the query parameters
        url_parts = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(url_parts.query)

        # Check if the path is our expected API endpoint
        if url_parts.path == '/api/scrape':
            query_term = query_params.get('q', [''])[0]
            
            # Use the scraper to get the products based on the query term
            products = self.scraper.search_products(query_term)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            # Prepare the response body as JSON
            response_body = json.dumps(products)
            self.wfile.write(response_body.encode('utf-8'))
        else:
            # Handle other paths with a 404 Not Found error
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_body = json.dumps({"error": "Endpoint not found."})
            self.wfile.write(response_body.encode('utf-8'))

def run_server():
    """
    Sets up and runs the HTTP server.
    """
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MyRequestHandler)
    print('Starting server on port 8000...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
