import { connectDB } from "./db";

const transactionData = async () => {
  try {
    connectDB();
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const methods = fetchedUser.methods;
    const categories = fetchedUser.categories;

    const response = await fetch(`/api/transaction/${fetchedUser.userId}`);
    const transactions = await response.json();

    transactions.forEach((transaction: any) => {
      const method = methods.find((method: any) => method.code === transaction.methodCode);
      transaction.methodCode = method.name;

      const category = categories.find((category: any) => category._id === transaction.categoryId);
      transaction.categoryId = category.name;
    });

    transactions.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const data = {
      transactions,
      methods,
      categories,
    };

    return data;
  } catch (error) {
    console.error(error);
  }
};

const savingsData = async () => {
  try {
    connectDB();
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const response = await fetch(`/api/savings/${fetchedUser.userId}`);
    const savings = await response.json();

    return savings;
  } catch (error) {
    console.error(error);
  }
};

export { transactionData, savingsData };
