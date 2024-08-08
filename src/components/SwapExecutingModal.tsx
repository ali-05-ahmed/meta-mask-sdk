import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";

interface SwapExecutingModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  transactionLinks?: string[];
  errorMessage?: string;
}

export default function SwapExecutingModal({
  isModalOpen,
  onClose,
  transactionLinks,
  errorMessage,
}: SwapExecutingModalProps) {
  return (
    <Drawer open={isModalOpen}>
      <DrawerTrigger></DrawerTrigger>
      <DrawerContent className="bg-[#1a222c] border-none flex justify-center">
        <DrawerHeader>
          <DrawerTitle>Swap Execution</DrawerTitle>
          {transactionLinks ? (
            <DrawerDescription>
              Transaction links:
              <pre>{transactionLinks.join("\n")}</pre>
            </DrawerDescription>
          ) : (
            <DrawerDescription className="text-red-600">
              {errorMessage || "Execution failed."}
            </DrawerDescription>
          )}
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={onClose}
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
