'use client';

import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Loader2 } from 'lucide-react';

// Define initial state for the product form
const initialProductState = {
  title: '',
  description: '',
  price: '',
  image: 'https://placehold.co/400x400/6b7280/ffffff?text=New+Product',
  stock: '1',
};

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState(initialProductState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- Protection Check ---
  // In this MVP, we only allow logged-in users (even anonymous ones) to see the panel.
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen-70 text-lg text-indigo-600">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading User Status...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8 max-w-xl text-center mt-10">
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600">You must be logged in to access the Admin Panel.</p>
      </div>
    );
  }
  // --- End Protection Check ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: `Product '${result.data.title}' added successfully! ID: ${result.data._id}` });
        setFormData(initialProductState); // Clear form on success
      } else {
        setMessage({ type: 'error', text: `Error: ${result.message || 'Failed to add product.'}` });
      }

    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: 'Network error or server connection failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const MessageBar = message ? (
    <div className={`p-4 rounded-lg font-medium mb-6 ${
      message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {message.text}
    </div>
  ) : null;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 flex items-center">
        <PlusCircle className="w-8 h-8 mr-3 text-indigo-600"/> Basic Admin Panel
      </h1>
      <p className="text-gray-600 mb-8">Add new products directly to your MongoDB database (connected via API route).</p>

      {MessageBar}

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Product Details</h2>
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Product Title*</label>
            <input type="text" id="title" name="title" required value={formData.title} onChange={handleInputChange} 
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea id="description" name="description" rows={3} required value={formData.description} onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)*</label>
              <input type="number" id="price" name="price" required value={formData.price} onChange={handleInputChange} step="0.01" min="0" 
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} min="0" 
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="url" id="image" name="image" value={formData.image} onChange={handleInputChange} 
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            <p className="text-xs text-gray-500 mt-1">Leave blank for a default placeholder image.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition duration-300 shadow-md ${
              isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                  Adding Product...
              </span>
            ) : (
              'Save New Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}