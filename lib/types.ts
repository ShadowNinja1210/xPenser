export type ICategory = {
  _id: object;
  name: string;
  description?: string;
  type: "Expense" | "Income";
};

export type TransactionData = {
  _id: string;
  userId: string;
  amount: number;
  type: "Expense" | "Income";
  categoryId: string;
  description: string;
  date: string;
  methodCode: string;
};

export type IUser = {
  userId: string;
  email: string;
  name: string;
  profilePicture?: string;
  methods: { _id: string; code: string; name: string }[];
  categories: ICategory[];
};

export type SavingsTransactions = {
  _id: string;
  amount: number;
  type: "Deposit" | "Withdrawal";
  description: string;
  date: Date;
};

export type ISavingsGoal = {
  _id: object;
  userId: string;
  name: string;
  targetAmount: number;
  achieved: number;
  source: string;
  description: string;
};
