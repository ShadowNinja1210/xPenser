import { TransactionData } from "@/lib/types";
import { create } from "zustand";

export type ModalType =
  | "Feedback"
  | "AddTransaction"
  | "AddSavings"
  | "AddDebt"
  | "AddSavingTransaction"
  | "EditTransaction"
  | "EditSavings"
  | "SavingsTransactions";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
  editData: any;
  savingId: string;
  setSavingId: (savingId: string) => void;
  setEditData: (data: any) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  editData: {},
  setEditData: (editData: TransactionData) => {
    set({ editData });
  },
  isOpen: false,
  savingId: "",
  setSavingId: (savingId: string) => {
    set({ savingId });
  },
  onOpen: (type: ModalType) => {
    set({ isOpen: true, type });
  },
  onClose: () => {
    set({ type: null, isOpen: false });
  },
}));

interface ModalStore2 {
  change: boolean;
  setChange: (isLoaded: boolean) => void;
}

export const useChangeModal = create<ModalStore2>((set) => ({
  change: false,
  setChange: (change: boolean) => {
    set({ change });
  },
}));

interface ModalStore3 {
  isLoaderOn: boolean;
  setIsLoaderOn: (isLoaded: boolean) => void;
}

export const useLoaderModal = create<ModalStore3>((set) => ({
  isLoaderOn: false,
  setIsLoaderOn: (isLoaderOn: boolean) => {
    set({ isLoaderOn });
  },
}));
