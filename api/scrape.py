import json
import urllib.parse
import os
import uuid
import time
from serpapi import GoogleSearch

# The main handler function for the serverless environment
def handler(event, context):
    try:
        # Check if query parameters exist and extract the search query
        query_params = urllib.parse.parse_qs(event.get('rawQueryString', ''))
        query_term = query_params.get('q', [''])[0]

        # Retrieve the API key from environment variables
        api_key = os.environ.get('SERPAPI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-type': 'application/json',
                },
                'body': json.dumps({'error': 'API key not found. Please set the SERPAPI_API_KEY environment variable.'})
            }

        # Initialize the SerpApi client
        client = GoogleSearch(params={
            "engine": "google_shopping",
            "q": query_term,
            "api_key": api_key,
            "tbs": "srch:1" # Limit to a single search source
        })

        # Get the results from the API
        results = client.get_dict()

        if "shopping_results" not in results:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-type': 'application/json',
                },
                'body': json.dumps([]) # Return an empty array if no results are found
            }

        # Process and filter the results
        products = []
        for item in results["shopping_results"][:6]: # Limit to 6 results
            products.append({
                'product_id': str(uuid.uuid4()),
                'source': item.get('source', 'Unknown'),
                'name': item.get('title', 'Product Name Not Found'),
                'price': item.get('price', 'Price Not Found'),
                'seller': item.get('merchant', 'Seller Not Found'),
                'url': item.get('link', '#'),
                'imageUrl': item.get('thumbnail', 'https://via.placeholder.com/150'),
                'dateScraped': time.strftime("%Y-%m-%d %H:%M:%S")
            })

        return {
            'statusCode': 200,
            'headers': {
                'Content-type': 'application/json',
            },
            'body': json.dumps(products)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
