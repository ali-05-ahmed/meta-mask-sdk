import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InputType = "seller" | "buyer";

export default function SwapInput({ type }: { type: InputType }) {
  const isSeller = type === "seller";

  return (
    <div className="flex items-center gap-4 relative">
      <Label className="text-left absolute left-5 top-[12px] z-10 pointer-events-none text-xs font-thin">
        You {isSeller ? "Sell" : "Buy"} Balance 100,000,000.0000{" "}
        {isSeller ? (
          <span className="text-green-500 font-normal">Max</span>
        ) : null}
      </Label>
      <Input
        type="number"
        placeholder="000,000,000.00"
        className="text-white bg-zinc-950 rounded-lg h-28 text-2xl border-none pl-5 focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
      <div className="absolute right-4">
        <Select defaultValue="ETH">
          <SelectTrigger className="w-[100px] bg-[#1a222c]">
            <div className="flex gap-1 items-center">
              <div className="h-4 w-4 bg-white rounded-full" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a222c]">
            <SelectGroup>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <p className="absolute left-5 top-[5.5rem] z-10 text-xs font-thin">
        〜$000,000.00
      </p>
    </div>
  );
}
