import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext'; // Import the hook

// Define the types
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

// --- Utility Component: Product Card ---
const ProductCard = ({ product }: { product: Product }) => {
  const { dispatch } = useCart();
  
  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    console.log(`Added ${product.title} to Cart Context.`);
  };

  return (
    <div className="bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl flex flex-col h-full border border-gray-100">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => e.currentTarget.src = 'https://placehold.co/400x400/6b7280/ffffff?text=Product'}
      />
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mt-auto">{product.title}</h3>
      <p className="text-xl font-bold text-indigo-600 mt-2">${product.price.toFixed(2)}</p>
      
      {product.stock > 0 ? (
          <button
            onClick={handleAddToCart} 
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-150 shadow-md"
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart ({product.stock} left)
          </button>
      ) : (
          <button
            disabled
            className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg font-medium cursor-not-allowed opacity-80"
          >
            Sold Out
          </button>
      )}
    </div>
  );
};

// --- Client-Side Data Fetching in a useEffect Hook ---
async function getProducts() {
  const res = await fetch('/api/products', { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.data || [];
}

// --- Home Page Component ---
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on component mount (client-side fetch)
  useEffect(() => {
    getProducts().then(fetchedProducts => {
      setProducts(fetchedProducts);
      setIsLoading(false);
    });
  }, []);
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Products (Live Data)
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            <p className="ml-3 text-gray-600">Loading products from API...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl shadow-inner">
            <p className="text-xl text-red-500 font-semibold">No Products Found.</p>
            <p className="text-gray-600">Check your API route for mock data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
