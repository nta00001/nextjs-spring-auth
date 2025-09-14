"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // State để lưu giá trị số thực gửi đi
  const [price, setPrice] = useState(''); 
  // State để hiển thị giá trị đã định dạng
  const [displayPrice, setDisplayPrice] = useState(''); 
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // 1. Loại bỏ tất cả các ký tự không phải là số
    const numericValue = rawValue.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setPrice('');
      setDisplayPrice('');
    } else {
      // 2. Lưu giá trị số thực
      setPrice(numericValue);
      // 3. Định dạng giá trị để hiển thị (thêm dấu phẩy)
      const formattedValue = parseInt(numericValue, 10).toLocaleString('en-US');
      setDisplayPrice(formattedValue);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('/api-proxy/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price), // Gửi đi giá trị số thực
          stock: parseInt(stock, 10),
          imageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(', ');
            throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Thêm sản phẩm thất bại');
      }

      alert('Thêm sản phẩm thành công!');
      router.push('/admin/products');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Thêm Sản phẩm mới</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Các trường input khác giữ nguyên */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
          </div>

          {/* Ô nhập giá đã được cập nhật */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
            <input
              id="price"
              type="text" // Thay đổi type="text"
              value={displayPrice} // Hiển thị giá trị đã định dạng
              onChange={handlePriceChange} // Sử dụng hàm xử lý mới
              required
              inputMode="numeric" // Gợi ý bàn phím số trên di động
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
            <input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Hình ảnh</label>
            <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-end space-x-4">
             <Link href="/admin/products" className="text-gray-600 hover:text-gray-800">
                Hủy
             </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}