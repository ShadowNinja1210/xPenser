const transactionData = async () => {
  try {
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

    transactions?.sort((a: any, b: any) => {
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
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const response = await fetch(`/api/savings/${fetchedUser.userId}`);
    const savings = await response.json();

    const sourceMetrics = new Map<string, number>();
    savings.forEach((goal: any) => {
      if (sourceMetrics.has(goal.source)) {
        sourceMetrics.set(goal.source, sourceMetrics.get(goal.source)! + goal.achieved);
      } else {
        sourceMetrics.set(goal.source, goal.achieved);
      }
    });
    const sourceMetricsArray = Array.from(sourceMetrics, ([source, achieved]) => ({ source, achieved }));

    return { savings, sourceMetricsArray };
  } catch (error) {
    console.error(error);
  }
};

const savingsTransactionsData = async (savingId: string) => {
  try {
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const savingGoals = await fetch(`/api/savings/${fetchedUser.userId}`);
    const savings = await savingGoals.json();

    const saving = savings.find((saving: any) => saving._id === savingId);

    const response = await fetch(`/api/savings/${fetchedUser.userId}/transactions/${savingId}`);
    let transactions = await response.json();
    transactions?.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return { transactions, saving };
  } catch (error) {
    console.error(error);
  }
};

const debtData = async () => {
  try {
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const response = await fetch(`/api/debt/${fetchedUser.userId}`);
    const debts = await response.json();

    return debts;
  } catch (error) {
    console.error(error);
  }
};

const debtTransactionData = async (debtId: string) => {
  try {
    const res = await fetch("/api/user");
    const fetchedUser = await res.json();

    const response = await fetch(`/api/debt/${fetchedUser.userId}/transactions/${debtId}`);
    let transactions = await response.json();
    transactions?.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return transactions;
  } catch (error) {
    console.error(error);
  }
};

export { transactionData, savingsData, savingsTransactionsData, debtData, debtTransactionData };
