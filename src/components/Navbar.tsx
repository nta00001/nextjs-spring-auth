"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname(); // Dùng để refresh state khi chuyển trang

  useEffect(() => {
    const checkUserStatus = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
          setIsLoggedIn(true);
          try {
            // Lấy thông tin người dùng để xác định vai trò
            const meResponse = await fetch(`/api-proxy/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (meResponse.ok) {
              const meData = await meResponse.json();
              const roles = meData.user.roles.map((role: any) => role.code);
              setUserRoles(roles);
            } else {
              // Nếu token không hợp lệ, đăng xuất người dùng
              handleLogout();
            }
          } catch (error) {
            console.error("Failed to fetch user info:", error);
            handleLogout();
          }
        } else {
          setIsLoggedIn(false);
          setUserRoles([]);
        }
      }
    };

    checkUserStatus();
  }, [pathname]); // Thêm pathname vào dependency array để kiểm tra lại mỗi khi chuyển trang

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUserRoles([]);
    router.push('/login');
  };

  const isAdmin = userRoles.includes('admin');

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href={isAdmin ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600">
            {isAdmin ? "Admin Panel" : "E-Shop"}
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Liên kết điều hướng dựa trên vai trò */}
            {isAdmin ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Tổng quan</Link>
                <Link href="/admin/products" className="text-gray-600 hover:text-indigo-600">Sản phẩm</Link>
                <Link href="/admin/orders" className="text-gray-600 hover:text-indigo-600">Đơn hàng</Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-indigo-600">Người dùng</Link>
              </>
            ) : (
              <>
                <Link href="/" className="text-gray-600 hover:text-indigo-600">Trang chủ</Link>
                <Link href="/products" className="text-gray-600 hover:text-indigo-600">Sản phẩm</Link>
                <Link href="/cart" className="text-gray-600 hover:text-indigo-600">Giỏ hàng</Link>
                <Link href="/orders" className="text-gray-600 hover:text-indigo-600">Đơn hàng</Link>
              </>
            )}
          </div>

          <div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Đăng xuất
              </button>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}