"use client";

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('/api-proxy/admin/orders', {
             headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Không thể tải danh sách đơn hàng');
        const data = await response.json();
        setOrders(data.list);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý Đơn hàng</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
       <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Đơn hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                 <td className="px-6 py-4 whitespace-nowrap">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.totalPrice.toLocaleString('vi-VN')} ₫</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}