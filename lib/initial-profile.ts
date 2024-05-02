import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { User } from "@/schema/schema";

const generatedCodes = new Set();
function generateAlphaNumericCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphaNumericCode =
    alphabet.charAt(Math.floor(Math.random() * alphabet.length)) +
    Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 10);
  if (generatedCodes.has(alphaNumericCode)) {
    return generateAlphaNumericCode();
  }
  generatedCodes.add(alphaNumericCode);
  return alphaNumericCode;
}

const InitialProfile = async () => {
  const user = await currentUser();
  await connectDB();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await User.findOne({ userId: user.id });

  if (profile) {
    return redirect("/dashboard");
  }

  if (!profile) {
    console.log("Creating new user profile...");
    const profile = await User.create({
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName + " " + user.lastName,
      profilePicture: user.imageUrl,
      methods: [
        {
          code: generateAlphaNumericCode(),
          name: "Cash",
        },
        {
          code: generateAlphaNumericCode(),
          name: "Credit Card",
        },
        {
          code: generateAlphaNumericCode(),
          name: "Debit Card",
        },
      ],
      categories: [
        {
          name: "Groceries",
          description: "Expenses related to grocery shopping",
          type: "Expense",
        },
        {
          name: "Salary",
          description: "Income from salary",
          type: "Income",
        },
        {
          name: "Entertainment",
          description: "Expenses related to entertainment activities",
          type: "Expense",
        },
        {
          name: "Investments",
          description: "Income from investments",
          type: "Income",
        },
        {
          name: "Utilities",
          description: "Expenses related to utility bills",
          type: "Expense",
        },
      ],
    });
  }
  return redirect("/dashboard");
};

export default InitialProfile;
