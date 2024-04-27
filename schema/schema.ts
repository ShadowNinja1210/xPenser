import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePicture: { type: String },
});

let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", userSchema);
}

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["Expense", "Income"], required: true },
});

let Category;
try {
  Category = mongoose.model("Category");
} catch (error) {
  Category = mongoose.model("Category", categorySchema);
}

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Expense", "Income"], required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  methodId: { type: String, required: true },
});

let Transaction;
try {
  Transaction = mongoose.model("Transaction");
} catch (error) {
  Transaction = mongoose.model("Transaction", transactionSchema);
}

// Payment Method Schema
const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

let PaymentMethod;
try {
  PaymentMethod = mongoose.model("PaymentMethod");
} catch (error) {
  PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
}

// Savings Account Schema
const savingsAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

let SavingsAccount;
try {
  SavingsAccount = mongoose.model("SavingsAccount");
} catch (error) {
  SavingsAccount = mongoose.model("SavingsAccount", savingsAccountSchema);
}

// Savings Goal Schema
const savingsGoalSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "SavingsAccount", required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
});

let SavingsGoal;
try {
  SavingsGoal = mongoose.model("SavingsGoal");
} catch (error) {
  SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);
}

// Savings Transaction Schema
const savingsTransactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "SavingsAccount", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Deposit", "Withdrawal"], required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

let SavingsTransaction;
try {
  SavingsTransaction = mongoose.model("SavingsTransaction");
} catch (error) {
  SavingsTransaction = mongoose.model("SavingsTransaction", savingsTransactionSchema);
}

export { User, Category, Transaction, PaymentMethod, SavingsAccount, SavingsGoal, SavingsTransaction };
