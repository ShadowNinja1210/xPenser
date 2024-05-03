import { NextApiRequest, NextApiResponse } from "next";
import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { Transaction } from "@/schema/schema";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

export async function POST(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const response = await currentProfile();
    const profile = response?.toJSON();

    const { amount, type, category, description, date, method } = await req.json();

    const { userId } = params.params;

    if (profile?.userId !== userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const categoryId = new mongoose.Types.ObjectId(category);

    const transaction = await Transaction.create({
      userId: profile.userId,
      amount: amount,
      type: type,
      categoryId: categoryId,
      description: description,
      date: date,
      methodCode: method,
    });

    return NextResponse.json(transaction, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
