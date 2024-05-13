import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modals-store";

export default function Debt() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "AddDebt";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new Saving Goal</DialogTitle>
          <DialogDescription>Add the details for new the new saving goal.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
