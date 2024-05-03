import { DataTable } from "@/components/table/data-table";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

// interface ICategory {
//   _id: string;
//   name: string;
//   description?: string;
//   type: "Expense" | "Income";
// }

// interface IUser {
//   userId: string;
//   email: string;
//   name: string;
//   profilePicture?: string;
//   methods: { code: string; name: string }[];
//   categories: ICategory[];
// }

export default async function Home() {
  const user = await currentUser();

  if (!user) return <RedirectToSignIn />;

  return (
    <>
      <DataTable />
    </>
  );
}
