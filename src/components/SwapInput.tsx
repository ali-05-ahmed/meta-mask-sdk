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
import { Skeleton } from "./ui/skeleton";
import { Chains, SwapInputProps } from "@/types/types";

export default function SwapInput({
  type,
  selectedChain,
  setSelectedChain,
  selectedToken,
  setSelectedToken,
  tokens,
  defaultValue,
  value,
  setValue,
  fromAmtUSD,
  toAmtUSD,
  balance,
  isLoading,
}: SwapInputProps) {
  const isSeller = type === "seller";

  const getChainIcon = (chain: Chains) => {
    return chain === "ARB" ? "/arb.png" : "/base.png";
  };

  const handleMaxClick = () => {
    if (isSeller) {
      setValue("100000000000");
    }
  };

  return (
    <div className="flex items-center gap-4 relative">
      <Label className="text-left absolute left-5 top-[12px] z-10 pointer-events-none text-xs font-thin">
        You {isSeller ? "Sell" : "Buy"} Balance {100000000000}
        {isSeller ? (
          <span
            className="text-green-500 font-normal cursor-pointer"
            onClick={handleMaxClick}
          >
            Max
          </span>
        ) : null}
      </Label>

      <Input
        type="number"
        placeholder="000,000,000.00"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-white bg-zinc-950 rounded-lg h-28 text-2xl border-none pl-5 focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
      <div className="absolute right-4 space-y-2">
        <Select
          defaultValue={defaultValue}
          onValueChange={(value: "ARB" | "BAS") => setSelectedChain(value)}
        >
          <SelectTrigger className="w-[100px] bg-[#1a222c] border-none">
            <div className="flex gap-1 items-center">
              <img
                src={getChainIcon(selectedChain)}
                alt={selectedChain}
                className="h-4 w-4 rounded-full"
              />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a222c] border-none text-white">
            <SelectGroup>
              <SelectItem value="ARB">ARB</SelectItem>
              <SelectItem value="BAS">BAS</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={selectedToken}
          onValueChange={(value: string) => setSelectedToken(value)}
        >
          <SelectTrigger className="w-[100px] bg-[#1a222c] border-none">
            <div className="flex gap-1 items-center">
              {tokens.find((t) => t.name === selectedToken) && (
                <img
                  src={tokens.find((t) => t.name === selectedToken)!.logo}
                  alt={selectedToken}
                  className="h-4 w-4 rounded-full"
                />
              )}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a222c] border-none text-white">
            <SelectGroup>
              {tokens.map((token) => (
                <SelectItem
                  key={token.address}
                  value={token.name}
                  className="flex items-center gap-1"
                >
                  <p>{token.name}</p>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <p className="absolute left-5 top-[5.5rem] z-10 text-xs font-thin">
        {isLoading ? (
          <Skeleton className="w-[100px] h-2 bg-gray-400 rounded-lg" />
        ) : (
          <>〜${isSeller ? fromAmtUSD : toAmtUSD}</>
        )}
      </p>
    </div>
  );
}
