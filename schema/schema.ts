import mongoose, { Document, Model, Schema } from "mongoose";

// --------------------
// Define interfaces for schemas
interface IUser extends Document {
  userId: string;
  email: string;
  name: string;
  profilePicture?: string;
}

interface ICategory extends Document {
  name: string;
  description?: string;
  type: "Expense" | "Income";
}

interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: "Expense" | "Income";
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  date: Date;
  methodId: string;
}

interface IPaymentMethod extends Document {
  name: string;
}

interface ISavingsAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  balance: number;
}

interface ISavingsGoal extends Document {
  accountId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
}

interface ISavingsTransaction extends Document {
  accountId: mongoose.Types.ObjectId;
  amount: number;
  type: "Deposit" | "Withdrawal";
  description?: string;
  date: Date;
}

// --------------------
// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePicture: { type: String },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// --------------------
// Category Schema
const categorySchema: Schema<ICategory> = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["Expense", "Income"], required: true },
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

// --------------------
// Transaction Schema
const transactionSchema: Schema<ITransaction> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Expense", "Income"], required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  methodId: { type: String, required: true },
});

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", transactionSchema);

// --------------------
// Payment Method Schema
const paymentMethodSchema: Schema<IPaymentMethod> = new mongoose.Schema({
  name: { type: String, required: true },
});

const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod || mongoose.model<IPaymentMethod>("PaymentMethod", paymentMethodSchema);

// --------------------
// Savings Account Schema
const savingsAccountSchema: Schema<ISavingsAccount> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

const SavingsAccount: Model<ISavingsAccount> =
  mongoose.models.SavingsAccount || mongoose.model<ISavingsAccount>("SavingsAccount", savingsAccountSchema);

// --------------------
// Savings Goal Schema
const savingsGoalSchema: Schema<ISavingsGoal> = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "SavingsAccount", required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
});

const SavingsGoal: Model<ISavingsGoal> =
  mongoose.models.SavingsGoal || mongoose.model<ISavingsGoal>("SavingsGoal", savingsGoalSchema);

// --------------------
// Savings Transaction Schema
const savingsTransactionSchema: Schema<ISavingsTransaction> = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "SavingsAccount", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Deposit", "Withdrawal"], required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const SavingsTransaction: Model<ISavingsTransaction> =
  mongoose.models.SavingsTransaction ||
  mongoose.model<ISavingsTransaction>("SavingsTransaction", savingsTransactionSchema);

export { User, Category, Transaction, PaymentMethod, SavingsAccount, SavingsGoal, SavingsTransaction };
