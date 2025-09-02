import { NextResponse } from 'next/server';

// This is a mock API route for a Next.js serverless function.
// It simulates the process of scraping multiple marketplaces.

// Define the shape of our mock product data.
interface Product {
    product_id: string;
    source: string;
    name: string;
    price: number;
    seller: string;
    url: string;
    imageUrl: string;
    timestamp: number;
}

// Mock database of products from different marketplaces.
const mockDatabase: Product[] = [
    {
        product_id: 'prod-001-tkp',
        source: 'Tokopedia',
        name: 'Keyboard Gaming Logitech G Pro X',
        price: 1800000,
        seller: 'Toko Gaming Pro',
        url: 'https://www.tokopedia.com/product-001',
        imageUrl: 'https://placehold.co/400x400/FF5722/FFFFFF?text=Logitech',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-002-shp',
        source: 'Shopee',
        name: 'Mouse Gaming Razer DeathAdder V2',
        price: 750000,
        seller: 'Shopee Gadget Store',
        url: 'https://shopee.co.id/product-002',
        imageUrl: 'https://placehold.co/400x400/EE4D2D/FFFFFF?text=Razer',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-003-blp',
        source: 'Bukalapak',
        name: 'Monitor Asus ROG Swift 240Hz',
        price: 6500000,
        seller: 'Buka Gaming Official',
        url: 'https://www.bukalapak.com/product-003',
        imageUrl: 'https://placehold.co/400x400/E51937/FFFFFF?text=Asus',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-004-lz',
        source: 'Lazada',
        name: 'Headset SteelSeries Arctis 7',
        price: 2200000,
        seller: 'Lazada Electronics',
        url: 'https://www.lazada.co.id/product-004',
        imageUrl: 'https://placehold.co/400x400/1E74FD/FFFFFF?text=SteelSeries',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-005-tkp',
        source: 'Tokopedia',
        name: 'Webcam Logitech C922 Pro',
        price: 1200000,
        seller: 'Toko Streamer',
        url: 'https://www.tokopedia.com/product-005',
        imageUrl: 'https://placehold.co/400x400/FF5722/FFFFFF?text=Logitech',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-006-shp',
        source: 'Shopee',
        name: 'Kursi Gaming Secretlab Titan',
        price: 5500000,
        seller: 'Official Gaming Store',
        url: 'https://shopee.co.id/product-006',
        imageUrl: 'https://placehold.co/400x400/EE4D2D/FFFFFF?text=Secretlab',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-007-blp',
        source: 'Bukalapak',
        name: 'Meja Gaming JYSK',
        price: 900000,
        seller: 'Furniture Online',
        url: 'https://www.bukalapak.com/product-007',
        imageUrl: 'https://placehold.co/400x400/E51937/FFFFFF?text=JYSK',
        timestamp: Date.now()
    },
    {
        product_id: 'prod-008-lz',
        source: 'Lazada',
        name: 'Microphone Blue Yeti',
        price: 1500000,
        seller: 'Lazada Store Elektronik',
        url: 'https://www.lazada.co.id/product-008',
        imageUrl: 'https://placehold.co/400x400/1E74FD/FFFFFF?text=Blue',
        timestamp: Date.now()
    },
];

// This is the main function that will be called by Next.js.
// It handles the GET request to the API route.
export async function GET(request: Request) {
    // Get the search query from the URL.
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing search query.' }, { status: 400 });
    }

    // Filter the mock database based on the query.
    const filteredProducts = mockDatabase.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    // Return the filtered products as a JSON response.
    return NextResponse.json(filteredProducts);
}
