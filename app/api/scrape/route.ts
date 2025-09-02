import { NextResponse } from 'next/server';

// This is a simulated product database. In a real-world scenario,
// you would replace this with actual web scraping logic.
const simulatedDatabase = {
  'iphone 15': [
    {
      source: 'Tokopedia',
      name: 'iPhone 15 128GB - Garansi Resmi',
      price: 13999000,
      seller: 'Apple Official Store',
      url: 'https://example.com/iphone15-tokopedia',
      imageUrl: 'https://placehold.co/400x400/3b82f6/ffffff?text=iPhone+15',
      timestamp: Date.now()
    },
    {
      source: 'Shopee',
      name: 'Apple iPhone 15 Pro Max 256GB',
      price: 22499000,
      seller: 'iBox',
      url: 'https://example.com/iphone15promax-shopee',
      imageUrl: 'https://placehold.co/400x400/9ca3af/ffffff?text=iPhone+15+Pro+Max',
      timestamp: Date.now()
    },
    {
      source: 'Lazada',
      name: 'iPhone 15 Pro 128GB - Pacific Blue',
      price: 18999000,
      seller: 'Lazada Mall',
      url: 'https://example.com/iphone15pro-lazada',
      imageUrl: 'https://placehold.co/400x400/10b981/ffffff?text=iPhone+15+Pro',
      timestamp: Date.now()
    }
  ],
  'samsung s24': [
    {
      source: 'Blibli',
      name: 'Samsung Galaxy S24 Ultra 512GB',
      price: 23999000,
      seller: 'Samsung Official Store',
      url: 'https://example.com/s24-blibli',
      imageUrl: 'https://placehold.co/400x400/f59e0b/ffffff?text=Galaxy+S24+Ultra',
      timestamp: Date.now()
    },
    {
      source: 'Shopee',
      name: 'Samsung S24 Plus 256GB - Onyx Black',
      price: 16999000,
      seller: 'Samsung Authorized',
      url: 'https://example.com/s24plus-shopee',
      imageUrl: 'https://placehold.co/400x400/ef4444/ffffff?text=Galaxy+S24+Plus',
      timestamp: Date.now()
    }
  ],
  'laptop': [
    {
      source: 'Tokopedia',
      name: 'Laptop ASUS VivoBook 14',
      price: 7500000,
      seller: 'ASUS Official',
      url: 'https://example.com/asus-vivobook',
      imageUrl: 'https://placehold.co/400x400/84cc16/ffffff?text=ASUS+Vivobook',
      timestamp: Date.now()
    },
    {
      source: 'Lazada',
      name: 'Laptop Lenovo IdeaPad Slim 3i',
      price: 8250000,
      seller: 'Lenovo Official',
      url: 'https://example.com/lenovo-ideapad',
      imageUrl: 'https://placehold.co/400x400/f97316/ffffff?text=Lenovo+IdeaPad',
      timestamp: Date.now()
    }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Return products based on the keyword
  const products = simulatedDatabase[query] || [];

  return NextResponse.json(products);
}
