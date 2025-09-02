"use client";

import { useState } from 'react';

type Product = {
  product_id: string;
  source: string;
  name: string;
  price: string;
  seller: string;
  url: string;
  imageUrl: string;
  dateScraped: string;
};

export default function Page() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (query.trim() === '') return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/scrape?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from API.');
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch data from API. Please check your network connection or try again later.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans flex flex-col items-center p-4">
      {/* Header Section */}
      <header className="text-center my-8 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 mb-2">
          Cari Produk Inceranmu
        </h1>
        <p className="text-lg md:text-xl font-light text-slate-300">
          Kami bantu kamu cari harga terbaik dari produk yang dicari
        </p>
      </header>

      {/* Search Bar Section */}
      <div className="w-full max-w-xl mb-8">
        <div className="relative flex rounded-full shadow-lg overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/50">
          <input
            type="text"
            className="flex-grow p-4 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            placeholder="Cari produk seperti 'keyboard gaming' atau 'sepatu lari'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 transition-colors duration-300 focus:outline-none"
            aria-label="Cari Produk"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="text-center text-red-400 p-4 rounded-lg bg-red-900/20">
            {error}
          </div>
        )}
        {!isLoading && products.length === 0 && query !== '' && (
          <div className="text-center text-slate-400 p-4">
            <p>Maaf, tidak ada produk yang ditemukan. Coba kata kunci lain.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <a key={product.product_id} href={product.url} target="_blank" rel="noopener noreferrer" className="block transform hover:scale-105 transition-transform duration-200">
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                <div className="p-2 aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-700">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain rounded-xl" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-100 mb-1 truncate">{product.name}</h3>
                  <div className="text-xl font-bold text-blue-400 mb-2">{product.price}</div>
                  <div className="flex items-center text-slate-400 text-sm mb-1">
                    <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{product.seller}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs mt-auto">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{product.dateScraped}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="mt-12 mb-4 text-center text-sm text-slate-500">
        <p>Craft with love. Laniakea Digital // Naimy</p>
      </footer>
    </div>
  );
}
