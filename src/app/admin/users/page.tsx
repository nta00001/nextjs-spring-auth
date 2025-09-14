"use client";

import { useState, useEffect } from 'react';

interface User {
  uuid: string;
  email: string;
  roles: { code: string }[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
       const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('/api-proxy/admin/users', {
             headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Không thể tải danh sách người dùng');
        const data = await response.json();
        setUsers(data.list);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchUsers();
  }, []);

  return (
     <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
       <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quyền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uuid}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {user.roles.map(role => role.code).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}