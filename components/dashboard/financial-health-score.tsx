"use client";

import { DonutChart, Legend } from "@tremor/react";
import { GiPayMoney } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";
import { FaPiggyBank } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { formatNum } from "@/lib/function-lib";

function calculateFinancialHealthScore(
  income: number,
  expenses: number,
  savings: number,
  debt: number,
  investments: number
) {
  const total = income - expenses - debt;
  const savingsPercentage = ((savings + investments) / total) * 100;

  if (total > 0 && savingsPercentage > 20) {
    return "Good";
  } else if (total === 0) {
    return "Average";
  } else {
    return "Poor";
  }
}

export function HealthDonut({
  transactions,
  income,
  investments,
}: {
  transactions: { name: string; transactions: number }[];
  income: number;
  investments: number;
}) {
  const [savings, setSavings] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [debt, setDebt] = useState(0);
  const [score, setScore] = useState("");

  useEffect(() => {
    transactions.map((transaction) => {
      if (transaction.name === "Expenses") {
        setExpenses(transaction.transactions);
      } else if (transaction.name === "Savings") {
        setSavings(transaction.transactions);
      } else if (transaction.name === "Debt") {
        setDebt(transaction.transactions);
      }
    });
  }, []);

  useEffect(() => {
    setScore(calculateFinancialHealthScore(income, expenses, savings, debt, investments));
  }, [income, expenses, savings, debt, investments]);

  return (
    <>
      <div className="font-semibold text-xl flex items-center justify-between">
        <p>Financial Health Score</p>
        <p
          className={`text-3xl ${
            score === "Poor" ? "text-red-600" : score === "Average" ? "text-orange-600" : "text-green-600"
          }`}
        >
          {score}
        </p>
      </div>
      <div className="flex items-center justify-center space-x-6">
        <DonutChart
          variant="donut"
          data={transactions}
          category="transactions"
          valueFormatter={(value) => `₹ ${formatNum(value)}`}
          label={score}
          index="name"
          colors={["red", "green", "orange", "blue"]}
          className="w-40 z-10"
          showAnimation
        />
        <Legend
          categories={["Expenses", "Savings", "Debt", "Balance"]}
          colors={["red", "green", "orange", "blue"]}
          className="max-w-xs"
        />
      </div>

      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <GiPayMoney className="text-[#ef4444] w-7 text-xl" />
            Expenses
          </span>
          <span>₹ {formatNum(expenses)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <TbReportMoney className="text-[#f97316] w-7 text-xl" />
            Debt
          </span>
          <span>₹ {formatNum(debt)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <FaPiggyBank className="text-[#84cc16] w-7 text-xl" />
            Savings
          </span>
          <span>₹ {formatNum(savings)}</span>
        </li>
      </ul>
    </>
  );
}
