import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cari Produk Inceranmu',
  description: 'Tulis produk yang kamu cari, pilih yang terbaik.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
