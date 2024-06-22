import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useChangeModal, useModal } from "@/hooks/use-modals-store";
import { useRouter } from "next/navigation";
import SavingsForm from "@/components/forms/savings-form";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name is too short" })
    .max(25, { message: "Name is too long" }),
  targetAmount: z.number({ message: "Target is required" }).min(0.01, { message: "Amount must be greater than 0" }),
  description: z
    .string({ message: "Description is required" })
    .min(3, { message: "Description is required" })
    .max(35, { message: "Name is too long" }),
});

export default function EditSavings() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { change, setChange } = useChangeModal();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/user`);
      const user = await res.json();
      const userId = user.userId;
      const dataToSend = {
        ...values,
        achieved: 0,
        source: "SBI Account",
      };

      const response = await fetch(`/api/savings/${userId}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.status === 200) {
        form.reset();
        setChange(!change);
        router.refresh();
        onClose();
      } else {
        throw new Error("Failed to add saving goal");
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "EditSavings";

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Saving Goal</DialogTitle>
          <DialogDescription>Add the details for new transaction.</DialogDescription>
        </DialogHeader>
        <SavingsForm form={form} onSubmit={onSubmit} formType="Edit" />
      </DialogContent>
    </Dialog>
  );
}
