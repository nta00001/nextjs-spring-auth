"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api-proxy/products');
      if (!response.ok) throw new Error('Không thể tải sản phẩm');
      const data = await response.json();
      setProducts(data.list);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch(`/api-proxy/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Xóa sản phẩm thất bại');
        
        // Tải lại danh sách sản phẩm sau khi xóa thành công
        fetchProducts(); 
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Thêm sản phẩm mới
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.price.toLocaleString('vi-VN')} ₫</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}