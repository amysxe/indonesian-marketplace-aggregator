import { NextResponse } from 'next/server';

// This is a mock data set to simulate product search results.
const MOCK_PRODUCTS = [
  {
    keyword: 'iPhone 15',
    data: [
      {
        source: 'Tokopedia',
        name: 'Apple iPhone 15 Pro Max',
        price: 25999000,
        seller: 'TokoGadget Resmi',
        url: '#',
        imageUrl: 'https://placehold.co/400x400/0891b2/ffffff?text=iPhone+15',
        timestamp: Date.now(),
      },
      {
        source: 'Shopee',
        name: 'iPhone 15 Pro (128GB)',
        price: 22499000,
        seller: 'Gadget Store',
        url: '#',
        imageUrl: 'https://placehold.co/400x400/0891b2/ffffff?text=iPhone+15',
        timestamp: Date.now(),
      },
      {
        source: 'Lazada',
        name: 'iPhone 15 Plus',
        price: 20500000,
        seller: 'Lazada Official',
        url: '#',
        imageUrl: 'https://placehold.co/400x400/0891b2/ffffff?text=iPhone+15',
        timestamp: Date.now(),
      },
    ],
  },
  {
    keyword: 'Samsung S24',
    data: [
      {
        source: 'Tokopedia',
        name: 'Samsung Galaxy S24 Ultra',
        price: 21999000,
        seller: 'Samsung Official',
        url: '#',
        imageUrl: 'https://placehold.co/400x400/0891b2/ffffff?text=Samsung+S24',
        timestamp: Date.now(),
      },
      {
        source: 'Shopee',
        name: 'Samsung S24+ (512GB)',
        price: 18499000,
        seller: 'Gadget Elektronik',
        url: '#',
        imageUrl: 'https://placehold.co/400x400/0891b2/ffffff?text=Samsung+S24',
        timestamp: Date.now(),
      },
    ],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Missing search query parameter' }, { status: 400 });
    }

    const keywordLower = query.toLowerCase();

    // Find the matching mock data
    const foundData = MOCK_PRODUCTS.find(p => p.keyword.toLowerCase() === keywordLower);

    if (foundData) {
      return NextResponse.json(foundData.data);
    } else {
      // Return an empty array if no match is found
      return NextResponse.json([]);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
