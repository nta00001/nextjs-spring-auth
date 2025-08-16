"use client";

import { useState, FormEvent } from "react";
import Link from "next/link"; // Import Link để điều hướng

export default function LoginPage() {
  const [email, setEmail] = useState("sysadmin@hp.com");
  const [password, setPassword] = useState("12345678"); // Sửa lại mật khẩu mặc định nếu cần
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setUserInfo(null);

    try {
      const response = await fetch(`/api-proxy/web-authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại!");
      }

      localStorage.setItem("access_token", data.access_token);
      alert("Đăng nhập thành công!");
      await getMyInfo(data.access_token);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const getMyInfo = async (token: string) => {
     try {
        const meResponse = await fetch(`/api-proxy/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if(!meResponse.ok) {
            const errorData = await meResponse.json();
            throw new Error(errorData.message || 'Không thể lấy thông tin người dùng.');
        }

        const meData = await meResponse.json();
        setUserInfo(meData);

     } catch (err: any) {
        setError(err.message);
     }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Đăng nhập
        </h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full transform rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Đăng nhập
          </button>
        </form>
        
        {/* Phần điều hướng sang trang đăng ký */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        {userInfo && (
            <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
                <h2 className="font-bold text-green-800">Thông tin User:</h2>
                <pre className="mt-2 whitespace-pre-wrap text-sm text-green-700">{JSON.stringify(userInfo, null, 2)}</pre>
            </div>
        )}
      </div>
    </main>
  );
}