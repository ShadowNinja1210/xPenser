import { NextResponse } from "next/server";
import { SavingsGoal } from "@/schema/schema";
import { connectDB } from "@/lib/db";

export async function GET(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const userId = params.params.userId;

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const response = await SavingsGoal.find({ userId });
    const savings = response.map((savings) => savings.toJSON());

    return NextResponse.json(savings, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
