// lib/dbConnect.js

import mongoose from 'mongoose';

// 1. Get the URI from your environment variables
const MONGODB_URI = process.env.MONGO_URI;

// Throw an error if the URI is not set (critical check)
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local'
  );
}

// 2. Cache the connection globally to prevent hot-reload duplicates
// Use a global variable so the connection state persists across module reloads.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// 3. The main connection function
async function dbConnect() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  // If we don't have a promise, start a new connection attempt
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended setting for Mongoose in Next.js
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  // Wait for the connection to resolve (either new or existing promise)
  try {
    cached.conn = await cached.promise;
    console.log("Successfully established new MongoDB connection.");
  } catch (e) {
    cached.promise = null; // Clear promise on error so the next attempt starts fresh
    throw e;
  }

  return cached.conn;
}

export default dbConnect;