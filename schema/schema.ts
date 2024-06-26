import mongoose, { Document, Model, Schema } from "mongoose";

// --------------------
// Define interfaces for schemas
interface IUser extends Document {
  userId: string;
  email: string;
  name: string;
  profilePicture?: string;
  methods: { code: string; name: string }[];
  categories: ICategory[];
}

interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: "Expense" | "Income";
}

interface ITransaction extends Document {
  userId: string;
  amount: number;
  type: "Expense" | "Income";
  categoryId: mongoose.Types.ObjectId;
  description: string;
  date: Date;
  methodCode: string;
}

interface ISavingsGoal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  targetAmount: number;
  achieved: number;
  source: string;
  description: string;
}

interface ISavingsTransaction extends Document {
  savingId: mongoose.Types.ObjectId;
  amount: number;
  type: "Deposit" | "Withdrawal";
  description?: string;
  date: Date;
}

// --------------------
// Category Schema
const categorySchema: Schema<ICategory> = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["Expense", "Income"], required: true },
});

// --------------------
// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePicture: { type: String },
  methods: [
    {
      code: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  categories: [categorySchema],
});

let User: Model<IUser>;
if (mongoose.models.User) {
  User = mongoose.model<IUser>("User");
} else {
  User = mongoose.model<IUser>("User", userSchema);
}

// --------------------
// Transaction Schema
const transactionSchema: Schema<ITransaction> = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Expense", "Income"], required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  methodCode: { type: String, required: true },
});

let Transaction: Model<ITransaction>;
if (mongoose.models.Transaction) {
  Transaction = mongoose.model<ITransaction>("Transaction");
} else {
  Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
}

// --------------------
// Savings Goal Schema
const savingsGoalSchema: Schema<ISavingsGoal> = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  achieved: { type: Number, required: true },
  source: { type: String, required: true },
  description: { type: String },
});

let SavingsGoal: Model<ISavingsGoal>;
if (mongoose.models.SavingsGoal) {
  SavingsGoal = mongoose.model<ISavingsGoal>("SavingsGoal");
} else {
  SavingsGoal = mongoose.model<ISavingsGoal>("SavingsGoal", savingsGoalSchema);
}

// --------------------
// Savings Transaction Schema
const savingsTransactionSchema: Schema<ISavingsTransaction> = new mongoose.Schema({
  savingId: { type: mongoose.Schema.Types.ObjectId, ref: "SavingsGoal", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Deposit", "Withdrawal"], required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

let SavingsTransaction: Model<ISavingsTransaction>;
if (mongoose.models.SavingsTransaction) {
  SavingsTransaction = mongoose.model<ISavingsTransaction>("SavingsTransaction");
} else {
  SavingsTransaction = mongoose.model<ISavingsTransaction>("SavingsTransaction", savingsTransactionSchema);
}

export { User, Transaction, SavingsGoal, SavingsTransaction };
