"use client";

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Trang quản trị</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products" className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-100">
            <h2 className="text-xl font-semibold">Quản lý Sản phẩm</h2>
            <p className="text-gray-600 mt-2">Thêm, sửa, xóa sản phẩm trong cửa hàng.</p>
        </Link>
        <Link href="/admin/orders" className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-100">
            <h2 className="text-xl font-semibold">Quản lý Đơn hàng</h2>
            <p className="text-gray-600 mt-2">Xem và cập nhật trạng thái các đơn hàng.</p>
        </Link>
        <Link href="/admin/users" className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-100">
            <h2 className="text-xl font-semibold">Quản lý Người dùng</h2>
            <p className="text-gray-600 mt-2">Xem và quản lý tài khoản người dùng.</p>
        </Link>
      </div>
    </main>
  );
}