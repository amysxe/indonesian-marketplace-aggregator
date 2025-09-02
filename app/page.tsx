import { useState, useEffect } from 'react';

type Product = {
  product_id: string;
  source: string;
  name: string;
  price: number;
  seller: string;
  url: string;
  imageUrl: string;
  timestamp: number;
};

// Main App component
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to format the price to Indonesian Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const response = await fetch(`/api/scrape?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from API.');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Invalid data format received from API.');
      }

    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch data from API. Please check your network connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 font-sans text-neutral-200 flex flex-col">
      <header className="bg-neutral-800 shadow-sm py-8 md:py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Cari Produk Inceranmu
          </h1>
          <p className="mt-2 text-base md:text-lg text-neutral-400">
            Kami bantu kamu cari harga terbaik dari produk yang dicari
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center space-x-2 bg-neutral-800 p-2 rounded-full shadow-md transition-all duration-300 focus-within:shadow-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 rounded-full focus:outline-none text-white placeholder-neutral-400 bg-transparent"
              placeholder="Cari produk di sini..."
            />
            <button
              type="submit"
              className="bg-emerald-500 text-white p-3 rounded-full shadow-md hover:bg-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>

        <div className="mt-8 md:mt-12">
          {loading && (
            <div className="text-center text-neutral-400">
              <p>Mencari produk...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400">
              <p>{error}</p>
            </div>
          )}

          {!loading && products.length === 0 && searchTerm.trim() && !error && (
            <div className="text-center text-neutral-400">
              <p>Tidak ada produk yang ditemukan.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <a
                key={product.product_id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-neutral-200 mb-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-emerald-400">
                    {formatRupiah(product.price)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    dari <span className="font-semibold">{product.source}</span>
                  </p>
                  <p className="text-xs text-neutral-400">
                    Penjual: {product.seller}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Diperbarui: {new Date(product.timestamp * 1000).toLocaleString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-neutral-800 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-neutral-400">
          <p>Craft with love. Laniakea Digital // Naimy</p>
        </div>
      </footer>
    </div>
  );
}
