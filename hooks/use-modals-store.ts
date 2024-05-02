import { create } from "zustand";

export type ModalType = "Feedback" | "AddTransaction";

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
