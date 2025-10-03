import './globals.css';
import { Inter } from 'next/font/google';
// 1. Import the Cart Provider to manage global state
import { CartProvider } from '@/context/CartContext'; 
// 2. Import the Navbar component
import Navbar from '@/components/Navbar'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '3-Hour E-Commerce Prototype',
  description: 'A minimal viable e-commerce shop built quickly with Next.js and Tailwind CSS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The CartProvider makes cart state available everywhere */}
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            
            {/* 3. Navbar: Sits at the top of every page */}
            <Navbar /> 

            {/* 4. Children: This is where the Home, Cart, or Checkout page content goes */}
            <main className="flex-grow">
              {children}
            </main>
            
            {/* 5. Footer: Sits at the bottom of every page */}
            <footer className="bg-gray-800 text-white text-center p-4">
                <p className="text-sm">© 2025 3H-Shop Prototype. Built with Next.js, Tailwind, and MongoDB.</p>
                <p className="text-xs text-gray-400">Next Tasks: Checkout & Admin Panel.</p>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
