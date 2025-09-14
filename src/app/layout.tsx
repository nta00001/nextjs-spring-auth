"use client"; // Thêm dòng này để sử dụng hook

import { usePathname } from 'next/navigation'; // Import hook
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Không cần export metadata từ đây nữa vì layout là client component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noNavFooterPaths = ['/login', '/register'];
  const showNavFooter = !noNavFooterPaths.includes(pathname);

  return (
    <html lang="en">
      <head>
          <title>E-Shop</title>
          <meta name="description" content="Your one-stop online shop" />
      </head>
      <body
        className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}
      >
        {showNavFooter && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {showNavFooter && <Footer />}
      </body>
    </html>
  );
}