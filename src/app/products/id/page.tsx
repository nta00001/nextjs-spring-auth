"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api-proxy/products/${id}`);
          if (!response.ok) {
            throw new Error('Không tìm thấy sản phẩm');
          }
          const data = await response.json();
          setProduct(data);
        } catch (err: any) {
          setError(err.message);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
      return;
    }

    try {
      const response = await fetch('/api-proxy/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product?.id, quantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Thêm vào giỏ hàng thất bại');
      }

      setSuccess('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!product) {
    return <p className="text-center mt-10">Đang tải...</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4">{product.price.toLocaleString('vi-VN')} ₫</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4">Số lượng:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded-md p-2"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
          >
            Thêm vào giỏ hàng
          </button>
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
      </div>
    </main>
  );
}