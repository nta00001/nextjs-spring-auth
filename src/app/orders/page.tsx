"use client";

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem lịch sử đơn hàng.');
        return;
      }

      try {
        const response = await fetch('/api-proxy/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải lịch sử đơn hàng');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);
  
    if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lịch sử đơn hàng</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Đơn hàng #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{order.totalPrice.toLocaleString('vi-VN')} ₫</p>
                  <p className="text-sm text-right">{order.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}