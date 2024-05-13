import Dashboard from "@/components/dashboard/dashboard";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  // if (!user) return <RedirectToSignIn />;

  return <Dashboard />;
}
