import { connectDB } from "./db";
import { getWeek, getMonth } from "date-fns";

const transactionMetrics = async () => {
  try {
    connectDB();
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const response = await fetch(`/api/transaction/${fetchedUser.userId}`);
    const transactions = await response.json();

    const today = new Date();
    const month = getMonth(today);
    const week = getWeek(today);

    let weeklyExpenses = 0;
    let monthlyExpenses = 0;
    let income = 0;

    transactions.forEach((transaction: any) => {
      if (transaction.type === "Expense") {
        if (getWeek(new Date(transaction.date)) === week) {
          weeklyExpenses += transaction.amount;
        }

        if (getMonth(new Date(transaction.date)) === month) {
          monthlyExpenses += transaction.amount;
        }
      }

      if (transaction.type === "Income") {
        income += transaction.amount;
      }
    });

    return { weeklyExpenses, monthlyExpenses, income };
  } catch (error) {
    console.error(error);
  }
};

export { transactionMetrics };
