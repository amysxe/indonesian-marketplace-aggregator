import { NextResponse } from 'next/server';

/**
 * Fetches real product data from a third-party scraping API.
 * @param query The search query string.
 * @returns A formatted list of products or an empty array on failure.
 */
async function scrapeProducts(query: string) {
  try {
    // Check if the API key is available from the environment variables.
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.error('SERPAPI_API_KEY is not set in environment variables.');
      return [];
    }
    
    // Construct the URL for the SerpApi request.
    const apiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

    // Make the API call to SerpApi.
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check for errors in the API response.
    if (data.error) {
      console.error('SerpApi Error:', data.error);
      return [];
    }

    // Process and format the data from the 'shopping_results' array.
    const products = data.shopping_results.map((item: any) => ({
      source: item.source || 'N/A',
      name: item.title,
      price: item.price_value, // SerpApi provides this as a number
      seller: item.merchant?.name || item.source || 'N/A',
      url: item.link,
      imageUrl: item.thumbnail,
      timestamp: Date.now()
    }));

    return products;
  } catch (error) {
    console.error('Failed to scrape products:', error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ message: "Query parameter 'q' is missing." }, { status: 400 });
    }

    const products = await scrapeProducts(query);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
