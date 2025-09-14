"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export default function EditProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [displayPrice, setDisplayPrice] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`/api-proxy/products/${id}`);
                    if (!response.ok) {
                        throw new Error('Không tìm thấy sản phẩm');
                    }
                    const data: Product = await response.json();
                    setProduct(data);
                    // Định dạng giá để hiển thị
                    setDisplayPrice(data.price.toLocaleString('en-US'));
                } catch (err: any) {
                    setError(err.message);
                }
            };
            fetchProduct();
        }
    }, [id]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/[^0-9]/g, '');

        if (numericValue === '') {
            setDisplayPrice('');
            setProduct(prev => prev ? { ...prev, price: 0 } : null);
        } else {
            const valueAsNumber = parseInt(numericValue, 10);
            setDisplayPrice(valueAsNumber.toLocaleString('en-US'));
            setProduct(prev => prev ? { ...prev, price: valueAsNumber } : null);
        }
    };


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!product) return;

        setError(null);
        setIsLoading(true);
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch(`/api-proxy/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...product,
                    price: product.price, // Gửi giá trị số
                    stock: Number(product.stock)
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || 'Cập nhật sản phẩm thất bại');
            }

            alert('Cập nhật sản phẩm thành công!');
            router.push('/admin/products');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!product) {
        return <div className="container mx-auto p-4">Đang tải...</div>
    }

    return (
        <main className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Chỉnh sửa Sản phẩm</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input id="name" name="name" type="text" value={product.name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea id="description" name="description" value={product.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
                        <input id="price" name="price" type="text" value={displayPrice} onChange={handlePriceChange} required inputMode="numeric" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                        <input id="stock" name="stock" type="number" value={product.stock} onChange={handleInputChange} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Hình ảnh</label>
                        <input id="imageUrl" name="imageUrl" type="url" value={product.imageUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex items-center justify-end space-x-4">
                        <Link href="/admin/products" className="text-gray-600 hover:text-gray-800">
                            Hủy
                        </Link>
                        <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}