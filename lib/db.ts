import connectDB from "@/lib/mongoose";
import { NextApiRequest, NextApiResponse } from "next";

connectDB();

const db = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: "Connected to MongoDB" });
};

export default db;
