"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api-proxy/products');
        if (!response.ok) {
          throw new Error('Không thể tải danh sách sản phẩm');
        }
        const data = await response.json();
        setProducts(data.list);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <Link href={`/products/${product.id}`}>
              <div>
                <img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-700 mt-2">{product.price.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}