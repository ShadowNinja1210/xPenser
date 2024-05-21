import { NextResponse } from "next/server";
import { SavingsTransaction } from "@/schema/schema";
import { connectDB } from "@/lib/db";

export async function GET(req: Request, params: { params: { userId: String; savingId: String } }) {
  try {
    connectDB();
    const userId = params.params.userId;
    const savingId = params.params.savingId;

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const response = await SavingsTransaction.find({ savingId });
    const savings = response.map((savings) => savings.toJSON());

    return NextResponse.json(savings, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
