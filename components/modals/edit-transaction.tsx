import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useChangeModal, useModal } from "@/hooks/use-modals-store";
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

export default function EditTransaction() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  const { isOpen, onClose, type, editData, setEditData } = useModal();
  const { change, setChange } = useChangeModal();
  const isModalOpen = isOpen && type === "EditTransaction";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: editData?.category,
      description: editData?.description,
      method: editData?.method,
      type: editData?.type,
      amount: editData?.amount,
      date: editData?.date,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/user`);
      const user = await res.json();
      const userId = user.userId;

      const data = { ...values, _id: editData._id };

      const response = await fetch(`/api/transaction/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to edit transaction");
      } else {
        form.reset();
        setChange(!change);
        router.refresh();
        onClose();
        setEditData({});
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>Edit the details for the transaction.</DialogDescription>
        </DialogHeader>
        <TransactionForm form={form} onSubmit={onSubmit} editData={editData} formType="Edit" />
      </DialogContent>
    </Dialog>
  );
}
