'use client'; // This directive indicates a Client Component

import { useState, useEffect } from 'react';

// Define the shape of our product data
interface Product {
  source: string;
  name: string;
  price: number;
  seller: string;
  url: string;
  imageUrl: string;
  timestamp: number;
}

export default function App() {
  const [keyword, setKeyword] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'price' | 'name'>('price');

  // Set the document title on component mount
  useEffect(() => {
    document.title = 'Cari Produk Inceranmu';
  }, []);

  // Handle the search form submission
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setError(null);
    setProducts([]); // Clear previous results

    try {
      // Fetch data from our new API endpoint
      const response = await fetch(`/api/scrape?q=${encodeURIComponent(keyword)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data from API.');
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sort the products based on the selected order
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'price') {
      return a.price - b.price;
    }
    // Sort by name if price is the same or if name is the chosen sort
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 pb-16">
      {/* Header and Search Form */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          Cari Produk Inceranmu
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Tulis produk yang kamu cari, pilih yang terbaik
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full sm:w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* Search Icon */}
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tulis nama produk yang mau dicari"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white dark:bg-gray-800"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg shadow-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {/* Loading Spinner */}
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mencari...</span>
              </>
            ) : (
              <span>Cari</span>
            )}
          </button>
        </form>
      </div>

      {/* Sorting Controls */}
      {products.length > 0 && (
        <div className="max-w-4xl mx-auto text-right mb-4">
          <label htmlFor="sort" className="text-sm font-medium mr-2">Urutkan berdasarkan:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'price' | 'name')}
            className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 bg-white dark:bg-gray-800"
          >
            <option value="price">Harga</option>
            <option value="name">Nama</option>
          </select>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md text-center">
            <p>{error}</p>
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <a
                key={index}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
              >
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/1f2937/d1d5db?text=Gambar+Tidak+Ditemukan"; }}
                  />
                  <span className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {product.source}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-xl font-bold mt-2 text-blue-600 dark:text-blue-400">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    Seller: {product.seller}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {products.length === 0 && !isLoading && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="mx-auto h-16 w-16 mb-4 opacity-50">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg">Tulis nama produk di atas untuk mulai mencari!</p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <p>Craft with love by Laniakea Digital // Naimy</p>
      </footer>
    </div>
  );
}
