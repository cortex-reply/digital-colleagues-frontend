import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateBusinessFunction } from "@/components/business-function/create-business-function"

interface CreateBusinessFunctionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateBusinessFunctionModal({ isOpen, onClose }: CreateBusinessFunctionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Business Function</DialogTitle>
        </DialogHeader>
        <CreateBusinessFunction onComplete={onClose} />
      </DialogContent>
    </Dialog>
  )
}

