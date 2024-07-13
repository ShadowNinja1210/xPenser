import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { DebtAccount } from "@/schema/schema";
import { connectDB } from "@/lib/db";

export async function POST(req: Request, params: { params: { userId: String } }) {
  try {
    connectDB();
    const response = await currentProfile();
    const profile = response?.toJSON();

    const {
      debtorName,
      amountBorrowed,
      amountToPay,
      dateBorrowed,
      dueDate,
      installments,
      source,
      interestRate,
      interestType,
      reason,
      status,
    } = await req.json();

    const { userId } = params.params;
    const data = await DebtAccount.create({
      userId,
      debtorName,
      amountBorrowed,
      amountWithInterest: amountToPay,
      amountToPay,
      interestRate,
      interestType,
      dateBorrowed,
      dueDate,
      source,
      status,
      reason,
      installments,
    });

    if (profile?.userId !== userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    return NextResponse.json(data, { status: 201 }); // 201 Created
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
