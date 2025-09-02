const { URL } = require('url');

/**
 * Fetches real product data from a third-party scraping API.
 * @param query The search query string.
 * @returns A formatted list of products or an empty array on failure.
 */
async function scrapeProducts(query) {
  try {
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.error('SERPAPI_API_KEY is not set in environment variables.');
      return [];
    }

    const apiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error('SerpApi Error:', data.error);
      return [];
    }
    
    // Define the list of valid marketplaces
    const marketplaces = ['tokopedia', 'lazada', 'bukalapak', 'shopee'];

    // Process and filter the data from the 'shopping_results' array.
    // We will use a flexible filter to check the URL or the source.
    const filteredProducts = data.shopping_results.filter(item => {
        if (!item.link || !item.source) {
            return false;
        }
        
        // Check if the link's domain or source contains any of the marketplace names
        return marketplaces.some(mp => 
            item.link.toLowerCase().includes(mp) || item.source.toLowerCase().includes(mp)
        );
    });

    const products = filteredProducts.slice(0, 6).map((item) => {
        let price = item.price_value;
        if (typeof price !== 'number') {
            try {
                price = parseFloat(item.price.replace(/[Rp.,]/g, ''));
            } catch (e) {
                price = 0;
            }
        }
        
        return {
            product_id: item.product_id,
            source: item.source || 'N/A',
            name: item.title,
            price: price,
            seller: item.merchant?.name || item.source || 'N/A',
            url: item.link,
            imageUrl: item.thumbnail,
        };
    });

    return products;
  } catch (error) {
    console.error('Failed to scrape products:', error);
    return [];
  }
}

exports.handler = async (event) => {
    try {
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
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(products),
        };
    } catch (error) {
        console.error('Error in API handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
