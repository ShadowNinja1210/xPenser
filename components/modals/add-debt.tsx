import { useEffect, useState } from "react";
import { useChangeModal, useModal } from "@/hooks/use-modals-store";
import { useRouter } from "next/navigation";

// Components
import DebtForm from "../forms/debt-form";

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Form Functions
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form Schema
const formSchema = z.object({
  debtorName: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name is too short" })
    .max(25, { message: "Name is too long" }),
  amountBorrowed: z.number({ message: "Target is required" }).min(0.01, { message: "Amount must be greater than 0" }),
  dateBorrowed: z.date().min(new Date(2022, 0, 1), { message: "Invalid date" }),
  dueDate: z.date().min(new Date(2022, 0, 1), { message: "Invalid date" }),
  installments: z.number({ message: "Installments is required" }).min(1, { message: "Amount must be greater than 0" }),
  source: z.string({ message: "Source is required" }),
  interestRate: z
    .number({ message: "Interest Rate is required" })
    .min(0.01, { message: "Amount must be greater than 0" }),
  amountToPay: z
    .number({ message: "Amount to pay is required" })
    .min(0.01, { message: "Amount must be greater than 0" }),
  reason: z
    .string({ message: "Reason is required" })
    .min(3, { message: "Reason is required" })
    .max(35, { message: "Name is too long" }),
});

// Main Component for Debt
export default function AddDebt() {
  // State
  const [isMounted, setIsMounted] = useState(false);

  // Mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modal Functions for fetching data
  const { change, setChange } = useChangeModal();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Fetching user data for userId
      const res = await fetch(`/api/user`);
      const user = await res.json();
      const userId = user.userId;
      const dataToSend = {
        ...values,
        status: "Unpaid",
      };

      // POST request to add new debt account
      const response = await fetch(`/api/debt/${userId}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // If successful, reset form, refresh page and close modal
      if (response.status === 201) {
        form.reset();
        setChange(!change);
        router.refresh();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Function to handle closing of the modal
  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Modal State
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "AddDebt";

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Debt Account</DialogTitle>
          <DialogDescription>Add the details for your new debt account.</DialogDescription>
        </DialogHeader>
        <DebtForm form={form} onSubmit={onSubmit} formType="Add" />
      </DialogContent>
    </Dialog>
  );
}
