// This file assumes you have installed Mongoose (npm install mongoose)

import mongoose from 'mongoose';

// Define the structure of a product, mapping directly to your plan:
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Check if the model already exists to prevent re-compilation on hot reload
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
