"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('/api-proxy/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Thanh toán thất bại');
      }

      alert('Đặt hàng thành công!');
      router.push('/orders');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
      <form onSubmit={handleCheckout}>
        <div className="mb-4">
          <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
          <textarea
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Đặt hàng
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </main>
  );
}