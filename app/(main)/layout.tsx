import Navbar from "@/components/navigation/navbar";
import { ModalProvider } from "@/components/providers/modal-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <ModalProvider />
      <Navbar />
      {children}
    </main>
  );
};

export default MainLayout;
