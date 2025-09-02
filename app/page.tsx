"use client";

import { useState } from 'react';

type Product = {
  product_id: string;
  source: string;
  name: string;
  price: number;
  seller: string;
  url: string;
  imageUrl: string;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setIsLoading(true);
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/scrape?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch data from API:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-neutral-900 text-white p-4 font-sans">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mt-12 mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Cari Produk Inceranmu
        </h1>
        <p className="text-lg text-neutral-400 mb-8">
          Tulis produk yang kamu cari, pilih yang terbaik.
        </p>
      </div>

      <div className="w-full max-w-xl flex items-center bg-white p-2 rounded-full shadow-lg border border-neutral-700">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Masukkan kata kunci produk..."
          className="flex-grow bg-white text-neutral-900 placeholder-neutral-500 p-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
          disabled={isSearching}
        >
          {isSearching ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Cari'
          )}
        </button>
      </div>

      {isLoading && (
        <p className="text-neutral-400 mt-8">Sedang mencari produk...</p>
      )}

      {!isLoading && hasSearched && products.length === 0 && (
        <p className="text-neutral-400 mt-8">Maaf, tidak ada produk yang ditemukan. Coba kata kunci lain.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10 max-w-7xl w-full">
        {products.map((product) => (
          <a
            key={product.product_id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-neutral-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden w-full h-[450px]"
          >
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="text-center w-full flex flex-col justify-between h-48">
              <div>
                <h3 className="text-lg font-semibold text-white truncate w-full mb-1">{product.name}</h3>
                <p className="text-md font-bold text-blue-400">
                  Rp{product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-neutral-500 mt-2">{product.source}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <footer className="w-full text-center mt-auto py-4 text-neutral-500 text-sm">
        Craft with love by Laniakea Digital // Naimy.
      </footer>
    </div>
  );
}
