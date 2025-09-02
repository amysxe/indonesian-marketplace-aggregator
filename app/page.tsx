'use client';

import { useState } from 'react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a product name to search.');
      return;
    }

    setIsLoading(true);
    setError('');
    setProducts([]);

    try {
      // The API endpoint is now relative to the root URL
      const response = await fetch(`/api/scrape?q=${encodeURIComponent(searchTerm)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        setError('No products found for your search. Please try a different keyword.');
      }
      setProducts(data);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setError('Failed to fetch data from API. Please check your network connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 p-8 font-sans antialiased">
      {/* Tailwind CSS for the page layout */}
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Main container with max-width and padding */}
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center my-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Cari Produk Inceranmu
          </h1>
          <p className="text-lg text-slate-600">
            Kami bantu kamu cari harga terbaik dari produk yang dicari
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="relative w-full sm:w-2/3 md:w-1/2">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-500 border-slate-200"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md my-8 text-center">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <a key={product.product_id} href={product.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Product Image */}
                <div className="w-full h-56 bg-slate-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {/* Product Details */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 truncate mb-1" title={product.name}>
                    {product.name}
                  </h2>
                  <p className="text-sm font-semibold text-indigo-600 mb-3">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">Source:</span> {product.source}
                  </p>
                  <p className="text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">Seller:</span> {product.seller}
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Scraped:</span> {product.dateScraped}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto mt-20 text-center text-slate-500 text-sm py-4 border-t border-slate-300">
        <p>Craft with love. Laniakea Digital // Naimy</p>
      </footer>
    </div>
  );
}
