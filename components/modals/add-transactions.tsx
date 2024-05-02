import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modals-store";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/forms/transaction-form";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  amount: z.number({ message: "Amount is required" }).min(0.01, { message: "Amount must be greater than 0" }),
  type: z.enum(["Expense", "Income"], { message: "Invalid type" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.date().min(new Date(2022, 0, 1), { message: "Invalid date" }),
  method: z.string().min(1, { message: "Payment method is required" }),
});

export default function AddTransactions() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  const today = new Date();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      description: "",
      date: today,
      method: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      form.reset();
      router.refresh();
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "AddTransaction";

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
          <DialogDescription>Add the details for new transaction.</DialogDescription>
        </DialogHeader>
        <TransactionForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
