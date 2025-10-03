import React from 'react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Checkout</h1>
      <div className="bg-white p-12 rounded-xl shadow-lg text-center border-dashed border-2 border-indigo-300">
        <p className="text-xl text-indigo-700">
          This is where the Stripe Mock Payment integration will go in **Hour 2**.
        </p>
      </div>
    </div>
  );
}