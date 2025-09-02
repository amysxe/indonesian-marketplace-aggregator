const { URLSearchParams } = require('url');

/**
 * Fetches real product data from a third-party scraping API.
 * @param query The search query string.
 * @returns A formatted list of products or an empty array on failure.
 */
async function scrapeProducts(query) {
  try {
    // Check if the API key is available from the environment variables.
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.error('SERPAPI_API_KEY is not set in environment variables.');
      return [];
    }
    
    // Construct the URL for the SerpApi request.
    const params = new URLSearchParams({
      engine: 'google_shopping',
      q: query,
      api_key: apiKey,
    });
    const apiUrl = `https://serpapi.com/search.json?${params.toString()}`;

    // Make the API call to SerpApi.
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check for errors in the API response.
    if (data.error) {
      console.error('SerpApi Error:', data.error);
      return [];
    }

    // Process and format the data from the 'shopping_results' array, limiting to 6 items.
    const products = (data.shopping_results || []).slice(0, 6).map((item) => ({
      source: item.source || 'N/A',
      name: item.title,
      price: item.price_value,
      seller: item.merchant?.name || item.source || 'N/A',
      url: item.link,
      imageUrl: item.thumbnail,
      timestamp: Date.now(),
      dateScraped: new Date().toLocaleDateString('en-US')
    }));

    return products;
  } catch (error) {
    console.error('Failed to scrape products:', error);
    return [];
  }
}

// The main handler for the Netlify serverless function.
exports.handler = async (event, context) => {
  try {
    // We expect a GET request with the query in the URL.
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Read the query from the URL parameters instead of the body.
    const query = event.queryStringParameters.q;
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Query parameter 'q' is missing." }),
      };
    }

    const products = await scrapeProducts(query);

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
