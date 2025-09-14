"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật
        const response = await fetch('/api-proxy/products?page=0&size=4');
        const data = await response.json();
        setFeaturedProducts(data.list);
      } catch (error) {
        console.error("Không thể tải sản phẩm nổi bật:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white">
        <div className="container mx-auto text-center py-20">
          <h1 className="text-5xl font-bold mb-4">Chào mừng đến với E-Shop</h1>
          <p className="text-xl mb-8">Nơi mua sắm trực tuyến tốt nhất cho mọi nhu cầu của bạn.</p>
          <Link href="/products" className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-200">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto p-4 mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Link href={`/products/${product.id}`}>
                <div>
                  <img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-gray-700 mt-2">{product.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}