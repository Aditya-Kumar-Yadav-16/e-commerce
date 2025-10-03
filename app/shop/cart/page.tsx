import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // Import the hook
import Link from 'next/link';

export default function CartPage() {
  const { cart, dispatch, cartCount } = useCart();
  const cartItems = cart.items;
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const CartItem = ({ item }: { item: any }) => (
    <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg hidden sm:block"/>
          <div>
              <p className="text-lg font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
          </div>
      </div>
      <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition">-</button>
              <span className="px-3 py-1 text-center w-8 bg-white">{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition">+</button>
          </div>
          <p className="text-lg font-semibold text-gray-800 w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
          <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition" aria-label={`Remove ${item.title}`}><X className="h-5 w-5" /></button>
      </div>
    </li>
  );
  
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Shopping Cart ({cartCount} items)</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {cartItems.length === 0 ? (
          <div className='text-center py-12'>
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty. </p>
            <Link href="/" className='text-indigo-600 font-semibold hover:text-indigo-800'>Start shopping here.</Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end">
              <div className="w-full sm:w-80 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium text-gray-900">Cart Subtotal:</span>
                  <span className="text-2xl font-extrabold text-indigo-600">${total.toFixed(2)}</span>
                </div>
                <Link 
                    href="/checkout"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-150 shadow-md text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}