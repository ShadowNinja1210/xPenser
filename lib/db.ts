import mongoose from "mongoose";

const MONGODB_URI = String(process.env.MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB database");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export { connectDB };
