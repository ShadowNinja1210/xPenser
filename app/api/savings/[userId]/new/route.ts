import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { SavingsGoal } from "@/schema/schema";
import { connectDB } from "@/lib/db";

export async function POST(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const response = await currentProfile();
    const profile = response?.toJSON();

    const { name, achieved, source, description, targetAmount } = await req.json();

    const { userId } = params.params;

    if (profile?.userId !== userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const transaction = await SavingsGoal.create({
      userId: profile.userId,
      name: name,
      targetAmount: targetAmount,
      achieved: achieved,
      source: source,
      description: description,
    });

    return NextResponse.json(transaction, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
