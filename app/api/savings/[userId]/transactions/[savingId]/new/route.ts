import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { SavingsTransaction, SavingsGoal } from "@/schema/schema";
import { connectDB } from "@/lib/db";

export async function POST(req: Request, params: { params: { userId: String; savingId: String } }) {
  try {
    await connectDB();
    const response = await currentProfile();
    const profile = response?.toJSON();

    const { amount, date, type, description } = await req.json();

    const { userId, savingId } = params.params;

    if (profile?.userId !== userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const transaction = await SavingsTransaction.create({
      savingId: savingId,
      amount: amount,
      date: date,
      type: type,
      description: description,
    });

    const saving = await SavingsGoal.findById(savingId);

    if (!saving) {
      return NextResponse.json("Savings Goal not found", { status: 404 });
    }

    const savingGoal = saving.toJSON();
    const savingGoalUpdate = {
      ...savingGoal,
      achieved: type === "Deposit" ? savingGoal.achieved + amount : savingGoal.achieved - amount,
    };
    await SavingsGoal.findByIdAndUpdate(savingId, savingGoalUpdate);

    return NextResponse.json(transaction, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
