import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
// import { getAuth } from 'firebase-admin/auth'; // In a real app, use Firebase Admin SDK here

// Handles POST requests to add a new product
export async function POST(request: Request) {
  try {
    // NOTE: In a REAL application, you must verify the user's role here
    // e.g., check if the user is a verified 'admin' before proceeding.
    // For this MVP, we rely on the client-side user check.

    await dbConnect();

    const productData = await request.json();

    // Input validation (basic check for required fields)
    if (!productData.title || !productData.price || !productData.description) {
        return NextResponse.json(
            { success: false, message: 'Missing required product fields.' },
            { status: 400 }
        );
    }

    // Create a new product in MongoDB
    const newProduct = await Product.create({
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price), // Ensure price is a number
      image: productData.image || undefined, // Use default if not provided
      stock: parseInt(productData.stock) || 1, // Ensure stock is an integer
    });

    console.log(`New product added: ${newProduct.title} (ID: ${newProduct._id})`);

    // Send the created product back
    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error adding product:", error.message);
    // Send back Mongoose validation errors if available
    const errorMessage = error.name === 'ValidationError' ? 
                         Object.values(error.errors).map((val: any) => val.message).join(', ') : 
                         'Internal server error while creating product.';

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
