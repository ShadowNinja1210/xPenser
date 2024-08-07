import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useChangeModal, useModal } from "@/hooks/use-modals-store";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { savingsTransactionsData } from "@/lib/fetch-data";
import { Loader } from "../loaders/loader";
import SavingTransactionForm from "../forms/savings-transactions-form";

const formSchema = z.object({
  amount: z.number({ message: "Amount is required" }).min(0.01, { message: "Amount must be greater than 0" }),
  type: z.enum(["Deposit", "Withdrawal"], { message: "Invalid type" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.date().min(new Date(2022, 0, 1), { message: "Invalid date" }),
});

export default function AddSavingTransactions() {
  const [savingGoal, setSavingGoal] = useState("");
  const [loader, setLoader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [target, setTarget] = useState({
    achieved: 0,
    target: 0,
  });

  const { change, setChange } = useChangeModal();
  const { isOpen, onClose, type, savingId } = useModal();
  const isModalOpen = isOpen && type === "AddSavingTransaction";

  useEffect(() => {
    setIsMounted(true);

    const fetchSavingGoal = async () => {
      try {
        const response = await savingsTransactionsData(savingId);
        setSavingGoal(response?.saving.name);
        setTarget({
          achieved: response?.saving?.achieved,
          target: response?.saving?.targetAmount,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoader(false);
      }
    };

    if (savingId) fetchSavingGoal();
  }, [savingId]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/user`);
      const user = await res.json();
      const userId = user.userId;

      const response = await fetch(`/api/savings/${userId}/transactions/${savingId}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      form.reset();
      setChange(!change);
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

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[385px]">
        {loader ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{savingGoal}</DialogTitle>
              <DialogDescription>Add the transaction details for the Saving Goal.</DialogDescription>
            </DialogHeader>
            <SavingTransactionForm form={form} onSubmit={onSubmit} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
