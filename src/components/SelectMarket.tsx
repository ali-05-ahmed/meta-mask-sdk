import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
  import { Button } from "./ui/button";
  import { Label } from "@/components/ui/label";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  
  export default function SelectMarket() {
    return (
      <Drawer>
        <DrawerTrigger>
          <Button >Market</Button>
        </DrawerTrigger>
        <DrawerContent className="bg-[#1a222c] border-none flex justify-center">
          <DrawerHeader>
            <DrawerTitle className="text-center text-sm text-white">
              Select a Market
            </DrawerTitle>
          </DrawerHeader>
          <DrawerFooter className="text-xs p-4">
            <RadioGroup defaultValue="comfortable" className="">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <img src="/Binance.svg" className="w-4 h-4" />
                  <Label htmlFor="r1">Binance(ABC/USDT)</Label>
                </span>
                <span className="flex items-center gap-2">
                  <p className="text-teal-500">000,000,000 USDT</p>
                  <RadioGroupItem value="default" id="r1" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 bg-white rounded-full" />
                  <Label htmlFor="r2">Dex Swap</Label>
                </span>
                <span className="flex items-center gap-2">
                  <p className="text-teal-500">000,000,000 USDT</p>
                  <RadioGroupItem value="comfortable" id="r2" />
                </span>
              </div>
            </RadioGroup>
            <div className="w-full flex flex-col gap-2 py-2">
              <Button className="btn-gradient text-white">Trading</Button>
              <DrawerClose className="w-full" asChild>
                <Button variant={"outline"} className="bg-transparent">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  