import LineLoader from "@/components/loaders/line-loader";
import Navbar from "@/components/navigation/navbar";
import { ModalProvider } from "@/components/providers/modal-provider";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (!user) return <RedirectToSignIn />;

  return (
    <main>
      <ModalProvider />
      <LineLoader />
      <Navbar />
      {children}
    </main>
  );
};

export default MainLayout;
