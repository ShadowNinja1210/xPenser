import { create } from "zustand";

export type ModalType = "Feedback" | "AddTransaction" | "AddSavings" | "AddDebt" | "AddSavingTransaction";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType) => {
    console.log("Opening modal", type);
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
