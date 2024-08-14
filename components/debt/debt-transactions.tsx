import mongoose from "mongoose";
import DebtTable from "./debt-table";
import { DebtTransactionsSide } from "./debt-transaction-side";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { debtData } from "@/lib/fetch-data";

// Sample Data
const sampleData = [
  {
    _id: new mongoose.Types.ObjectId(1),
    debtAccId: new mongoose.Types.ObjectId("66924490db61f14e59df1486"),
    type: "Payment",
    amount: 5000,
    date: new Date("07-25-2024"),
    modeOfPayment: "UPI",
    remarks: "Paid 2nd installment",
  },
  {
    _id: new mongoose.Types.ObjectId(2),
    debtAccId: new mongoose.Types.ObjectId("66924490db61f14e59df1486"),
    type: "Payment",
    amount: 5000,
    date: new Date("06-25-2024"),
    modeOfPayment: "UPI",
    remarks: "Paid 1st installment",
  },
  {
    _id: new mongoose.Types.ObjectId(3),
    debtAccId: new mongoose.Types.ObjectId("66924490db61f14e59df1486"),
    type: "Penalty",
    amount: 600,
    date: new Date("06-25-2024"),
    modeOfPayment: "Net Banking",
    remarks: "Paid penalty for late payment",
  },
];

export default async function DebtTransactions({ accountId }: { accountId: string }) {
  const debtsData = await debtData();
  const debtorData = await debtsData.find((debt: any) => debt._id === accountId);

  return (
    <div>
      <h1>Debt Transactions</h1>
      <div className="grid items-start gap-4 md:gap-8 xl:grid-cols-[minmax(320px,7fr)_minmax(200px,2fr)] lg:grid-cols-[minmax(320px,4fr)_minmax(200px,2fr)]">
        <section>
          <DebtTable
            debtorName={debtorData.debtorName}
            filteredData={sampleData.filter((item) => item.debtAccId.toString() === accountId)}
          />
        </section>
        <section>
          <DebtTransactionsSide
            debtData={debtorData}
            data={sampleData.filter((item) => item.debtAccId.toString() === accountId)}
          />
        </section>
      </div>
    </div>
  );
}
