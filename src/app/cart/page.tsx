"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Bạn cần đăng nhập để xem giỏ hàng.');
      return;
    }

    try {
      const response = await fetch('/api-proxy/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải giỏ hàng');
      }
      const data = await response.json();
      setCart(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId: number) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`/api-proxy/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (err) {
      setError('Lỗi khi xóa sản phẩm');
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!cart) {
    return <p className="text-center mt-10">Đang tải...</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      {cart.items.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <img src={item.product.imageUrl || '/placeholder.svg'} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-gray-600">{item.product.price.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="mr-4">Số lượng: {item.quantity}</p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <h2 className="text-2xl font-bold">Tổng cộng: {cart.totalPrice.toLocaleString('vi-VN')} ₫</h2>
            <Link href="/checkout" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">
                Tiến hành thanh toán
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}