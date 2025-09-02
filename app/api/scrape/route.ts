import { NextResponse } from 'next/server';

/**
 * Generates a mock product list based on a search query.
 * @param query The search term from the user.
 * @returns An array of mock product objects.
 */
function generateMockProducts(query: string) {
  const sources = ['Tokopedia', 'Shopee', 'Lazada', 'Blibli', 'Bukalapak'];
  const sellers = ['Official Store', 'Authorized Reseller', 'Super Seller', 'Star Seller'];
  const basePrice = Math.floor(Math.random() * (10000000 - 500000 + 1)) + 500000;

  return Array.from({ length: 5 }).map((_, index) => {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const seller = sellers[Math.floor(Math.random() * sellers.length)];
    const price = basePrice + (index * 50000);
    
    // Create a dynamic image URL based on the product name
    const imageUrl = `https://placehold.co/400x400/3b82f6/ffffff?text=${encodeURIComponent(query)}`;

    return {
      source: source,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} [Toko ${source}]`,
      price: price,
      seller: `${seller} ${source}`,
      url: `https://example.com/${query}-${source.toLowerCase()}`,
      imageUrl: imageUrl,
      timestamp: Date.now()
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();

  // If no query is provided, return an empty array
  if (!query) {
    return NextResponse.json([]);
  }

  // Generate and return a dynamic list of mock products
  const products = generateMockProducts(query);
  return NextResponse.json(products);
}
