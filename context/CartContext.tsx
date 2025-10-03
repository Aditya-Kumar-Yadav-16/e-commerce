// context/CartContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// --- Type Definitions ---
interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
}

interface CartActions {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  payload: any;
}

interface CartContextType {
  cart: CartState;
  dispatch: React.Dispatch<CartActions>;
  cartCount: number;
}

// --- Initial State ---
const initialState: CartState = {
  items: [],
};

// --- Reducer Function (The Redux Toolkit Equivalent) ---
const cartReducer = (state: CartState, action: CartActions): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product: Product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY': {
        const { id, quantity } = action.payload;
        if (quantity <= 0) {
            return {
                ...state,
                items: state.items.filter(item => item.id !== id),
            };
        }
        return {
            ...state,
            items: state.items.map(item => 
                item.id === id ? { ...item, quantity } : item
            ),
        };
    }
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

// --- Context and Provider ---
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};