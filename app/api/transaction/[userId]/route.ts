import { NextResponse } from "next/server";
import { Transaction } from "@/schema/schema";
import { connectDB } from "@/lib/db";
export async function GET(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const userId = params.params.userId;

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const response = await Transaction.find({ userId });
    const transactions = response.map((transaction) => transaction.toJSON());

    return NextResponse.json(transactions, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const userId = params.params.userId;
    const body = await req.json();
    const { _id, ...data } = body;

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const response = await Transaction.findOne({ userId });

    if (response) {
      await Transaction.updateOne({ userId, _id }, data);
    } else {
      return NextResponse.json("Transaction not found", { status: 404 });
    }

    return NextResponse.json("Transaction added successfully", { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const userId = params.params.userId;
    const body = await req.json();
    const ids = body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No transaction IDs provided" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    await Transaction.deleteMany({ userId, _id: { $in: ids } });

    return NextResponse.json("Deleted", { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
