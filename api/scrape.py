import os
import json
import uuid
from urllib.parse import urlparse, parse_qs
from serpapi import GoogleSearch
from datetime import datetime

# This is the main handler function for the Netlify serverless environment.
# It receives an event object containing details about the incoming request.
def handler(event, context):
    try:
        # Get the search query from the URL's query string parameters.
        # We use a default value 'hp samsung' if no query is provided.
        query_string = event.get('queryStringParameters', {})
        search_query = query_string.get('q', 'hp samsung')

        # Retrieve the API key from environment variables.
        # This is the safest way to handle secrets like API keys.
        api_key = os.environ.get('SERPAPI_API_KEY')
        
        # If the API key is not found, return a 500 server error.
        if not api_key:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "SerpAPI key not found. Please set the SERPAPI_API_KEY environment variable in Netlify."})
            }

        # Set up the parameters for the Google Shopping search using SerpApi.
        params = {
            "api_key": api_key,
            "engine": "google_shopping",
            "q": search_query,
            "location": "Indonesia",
            "gl": "id",
            "hl": "id",
            "tbs": "srch:4128532", # A filter to specifically search Indonesian marketplaces
            "num": 6,              # Limit the results to 6 items
        }

        # Create a GoogleSearch object and get the results from the API.
        search = GoogleSearch(params)
        results = search.get_dict()
        shopping_results = results.get('shopping_results', [])

        # If no shopping results are found, return an empty array to the frontend.
        if not shopping_results:
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps([])
            }

        # Process the results into the format that our frontend expects.
        products = []
        for item in shopping_results:
            # Safely extract the seller name from the product link.
            seller_link = item.get('link', None)
            seller_name = None
            if seller_link:
                try:
                    parsed_url = urlparse(seller_link)
                    seller_name = parsed_url.netloc.replace('www.', '').split('.')[0].capitalize()
                except Exception:
                    seller_name = "Unknown Seller"
            
            # Append a new product dictionary to our list.
            products.append({
                "product_id": str(uuid.uuid4()), # Generate a unique ID for each product
                "product_name": item.get('title', 'N/A'),
                "product_pricing": item.get('extracted_price', 'N/A'),
                "product_link": item.get('link', '#'),
                "product_image": item.get('thumbnail', 'https://via.placeholder.com/150'),
                "seller_name": seller_name,
                "dateScraped": datetime.now().strftime("%Y-%m-%d")
            })

        # Return a successful response with the products data.
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(products)
        }
    
    except Exception as e:
        # If any error occurs, return a 500 server error with a detailed message.
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"An error occurred: {str(e)}"})
        }
