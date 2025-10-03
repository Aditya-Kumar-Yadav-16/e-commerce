'use client'; 

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Truck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, dispatch } = useCart();
  const cartItems = cart.items;
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = parseFloat(total.toFixed(2));

  const [shippingDetails, setShippingDetails] = useState({ name: '', email: '', address: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  // If the cart is empty, redirect or show a message
  if (cartItems.length === 0 && orderStatus === 'idle') {
    return (
      <div className="container mx-auto p-8 max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty!</h1>
        <p className="text-lg text-gray-600 mb-8">Please add items to your cart before checking out.</p>
        <Link href="/" className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setOrderStatus('idle');

    // Prepare order payload
    const payload = {
      ...shippingDetails,
      items: cartItems,
      totalAmount: totalAmount,
    };

    try {
      // Call the mock Order API
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setOrderStatus('success');
        // Critical step: Clear the cart after successful order
        dispatch({ type: 'CLEAR_CART', payload: null });
      } else {
        setOrderStatus('failure');
      }
    } catch (error) {
      console.error("Checkout submission error:", error);
      setOrderStatus('failure');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // --- Success State UI ---
  if (orderStatus === 'success') {
    return (
      <div className="container mx-auto p-8 max-w-2xl text-center bg-green-50 rounded-xl shadow-lg mt-10">
        <h1 className="text-4xl font-extrabold text-green-700 mb-4">Order Placed! 🚀</h1>
        <p className="text-xl text-gray-700 mb-6">Thank you for your order. Your mock Order ID is: MOCK-12345</p>
        <p className="text-lg text-gray-600 mb-8">We've simulated saving your order to MongoDB.</p>
        <Link href="/" className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // --- Main Checkout UI ---
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Secure Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Shipping & Payment */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Truck className="w-6 h-6 mr-2 text-indigo-500" /> Shipping Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                required
                value={shippingDetails.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                required
                value={shippingDetails.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <input 
                type="text" 
                id="address" 
                name="address"
                required
                value={shippingDetails.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-6 border-t mt-6 flex items-center"><Lock className="w-6 h-6 mr-2 text-red-500" /> Payment (Mock)</h2>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-700">Mock Payment Integration:</p>
                <p className="text-sm text-red-600">This prototype step simulates a successful Stripe payment. No actual card details are needed.</p>
            </div>

            {orderStatus === 'failure' && (
                <div className="p-3 bg-red-100 text-red-800 rounded-lg font-semibold text-center">
                    Order failed! Please try again.
                </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || totalAmount === 0}
              className={`w-full py-4 rounded-xl text-xl font-bold transition duration-300 shadow-xl ${
                isProcessing || totalAmount === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing Order...
                </span>
              ) : (
                `Place Order - $${totalAmount.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
        
        {/* Right Column: Order Summary */}
        <div className="lg:w-1/3 bg-gray-50 p-6 rounded-xl shadow-inner h-fit border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <ul className="space-y-3 border-b pb-4 mb-4">
                {cartItems.map(item => (
                    <li key={item.id} className="flex justify-between text-gray-600">
                        <span>{item.title} ({item.quantity})</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between font-semibold text-gray-800">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-2xl text-indigo-700 pt-3 border-t mt-3">
                <span>Order Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
