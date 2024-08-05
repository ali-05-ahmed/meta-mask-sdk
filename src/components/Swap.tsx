"use client";

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
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import SwapInput from "./SwapInput";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Swap() {
  const [selectedSlippage, setSelectedSlippage] = useState(null);

  const handleSlippageChange = (value: any) => {
    setSelectedSlippage(value);
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button>Swap</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#1a222c] border-none flex justify-center">
        <DrawerHeader>
          <DrawerTitle className="text-center text-sm text-white flex justify-between items-center">
            <span></span>
            <span>Swap</span> <Settings />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerFooter className="text-xs p-4">
          <div className="space-y-2">
            <div className="flex flex-col space-y-1 w-full">
              <Label className="font-thin">Chain</Label>
              <Button className="flex font-light justify-between rounded-lg text-white bg-zinc-950">
                <span className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-white rounded-full" />
                  Etherem
                </span>
                <ChevronDown />
              </Button>
            </div>
            <div>
              <SwapInput type="seller" />
              <SwapInput type="buyer" />
            </div>
            <div className="ml-2 flex items-center gap-2">
              <Label className="text-sm">Slippage</Label>
              <div className="flex gap-1">
                {["0.1", "0.5", "1"].map((slip) => (
                  <Button
                    key={slip}
                    type="button"
                    onClick={() => handleSlippageChange(slip)}
                    className={`flex items-center w-1/6 text-white hover:bg-zinc-950 font-thin h-8 p-2 text-xs justify-center rounded-lg bg-zinc-950 cursor-pointer
                    ${
                      selectedSlippage === slip
                        ? "border border-green-500"
                        : "border border-transparent"
                    }`}
                  >
                    {slip}%
                  </Button>
                ))}
                <Input
                  placeholder={`input${"                       "}%`}
                  value={
                    selectedSlippage &&
                    !["0.1", "0.5", "1"].includes(selectedSlippage)
                      ? selectedSlippage
                      : ""
                  }
                  onChange={(e) => handleSlippageChange(e.target.value)}
                  className="text-xs w-1/2 h-8 rounded-lg bg-zinc-950 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between ml-2">
              <Label className="text-sm">DEX</Label>
              <Button className="flex items-center font-light text-xs h-8 w-full justify-between rounded-lg text-white bg-zinc-950">
                <span className="flex items-center gap-1">Uniswap</span>
                <span className="flex items-center gap-0.5">
                  <p>1ETH = 000,000.00000000</p>
                  <p className="text-green-500">Best</p>
                  <ChevronRight />
                </span>
              </Button>
            </div>
            <div className="text-xs pt-1 ml-2">
              <dl className="space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <dt>Network Fee</dt>
                  <dt>0.0000000(〜$0.0005)</dt>
                </div>
                <div className="flex justify-between">
                  <dt>Protocol Fee</dt>
                  <dt>0.0000000(〜$0.0000)</dt>
                </div>
                <div className="flex justify-between">
                  <dt>Minimum Recevied</dt>
                  <dt>000,000,000.00000000 USD</dt>
                </div>
              </dl>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            <Button className="btn-gradient text-white">Swap</Button>
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
