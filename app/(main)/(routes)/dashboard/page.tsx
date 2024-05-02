import { DataTable } from "@/components/table/data-table";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const data = [
    {
      id: "1",
      userId: "609c1c5cf4c58d44d0184f5a",
      amount: 50,
      type: "Expense",
      categoryId: "Grocery",
      description: "Grocery shopping",
      date: "2024-04-19T12:00:00.000Z",
      methodId: "Credit Card",
    },
    {
      id: "2",
      userId: "609c1c5cf4c58d44d0184f5a",
      amount: 30,
      type: "Expense",
      categoryId: "Food & Drinks",
      description: "Lunch with friends",
      date: "2024-04-18T13:30:00.000Z",
      methodId: "Debit Card",
    },
    {
      id: "3",
      userId: "609c1c5cf4c58d44d0184f5a",
      amount: 200,
      type: "Expense",
      categoryId: "Clothing",
      description: "New pair of shoes",
      date: "2024-04-17T11:00:00.000Z",
      methodId: "Cash",
    },
    {
      id: "4",
      userId: "609c1c5cf4c58d44d0184f5a",
      amount: 1000,
      type: "Expense",
      categoryId: "Electronics",
      description: "New laptop",
      date: "2024-04-16T16:45:00.000Z",
      methodId: "Credit Card",
    },
    {
      id: "5",
      userId: "609c1c5cf4c58d44d0184f5a",
      amount: 1000,
      type: "Income",
      categoryId: "Salary",
      description: "TaskUs Salary",
      date: "2024-04-01T16:45:00.000Z",
      methodId: "Credit Card",
    },
  ];

  return (
    <>
      <DataTable data={data} />
    </>
  );
}
