// components/Navbar.tsx
'use client'; // <-- THIS IS THE FIX

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Home, CreditCard, Menu, X, LogIn, LogOut, User, DollarSign, Loader2, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, signInAnonymously, signOutUser, isLoading: authLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Admin', href: '/admin', icon: DollarSign, adminOnly: true },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-150">
            <Zap className="h-6 w-6 mr-1" />
            3H-Shop
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (link.adminOnly && !user) return null; // Hide Admin if not logged in
              return (
                <Link key={link.name} href={link.href} className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150 flex items-center">
                  <link.icon className="h-5 w-5 mr-1" />
                  {link.name}
                  {link.name === 'Cart' && (
                    <span className="ml-1.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Button & Cart (Desktop) */}
          <div className="flex items-center space-x-4">
            {authLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center text-sm text-gray-700 bg-indigo-100 px-3 py-1 rounded-full hover:bg-indigo-200 transition">
                  <User className="h-4 w-4 mr-1" />
                  Signed In
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl py-1 hidden group-hover:block transition-all duration-200">
                  <button
                    onClick={signOutUser}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={signInAnonymously}
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md flex items-center"
              >
                <LogIn className="h-5 w-5 mr-1" /> Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 rounded-lg transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 py-2">
          {navLinks.map((link) => {
            if (link.adminOnly && !user) return null;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150"
              >
                <div className="flex items-center">
                    <link.icon className="h-5 w-5 mr-3" />
                    {link.name}
                    {link.name === 'Cart' && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
