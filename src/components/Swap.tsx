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
import {
  ChevronDown,
  ChevronRight,
  Fuel,
  LockOpen,
  Settings,
} from "lucide-react";
import SwapInput from "./SwapInput";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { getTokensFromChain, requestRoutes } from "@/lib/lifi";
import { ChainId } from "@lifi/sdk";
import { Skeleton } from "./ui/skeleton";
import SwapSlider from "./SwapSlider";
import { CarouselNext } from "./ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

type Token = {
  name: string;
  decimals: number;
  logo: string;
  address: string;
};

export default function Swap() {
  const [selectedSlippage, setSelectedSlippage] = useState<string | null>(null);
  const [routes, setRoutes] = useState<any>(null);
  const [sellerChain, setSellerChain] = useState<"ARB" | "BAS">("ARB");
  const [buyerChain, setBuyerChain] = useState<"ARB" | "BAS">("BAS");
  const [sellerToken, setSellerToken] = useState<string>("");
  const [buyerToken, setBuyerToken] = useState<string>("");
  const [sellerTokens, setSellerTokens] = useState<Token[]>([]);
  const [buyerTokens, setBuyerTokens] = useState<Token[]>([]);
  const [sellerValue, setSellerValue] = useState<string>("");
  const [buyerValue, setBuyerValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSlippageChange = (value: string) => {
    setSelectedSlippage(value);
  };

  const handleSellerChainChange = (newChain: "ARB" | "BAS") => {
    setSellerChain(newChain);
    setSellerToken("");
  };

  const handleBuyerChainChange = (newChain: "ARB" | "BAS") => {
    setBuyerChain(newChain);
    setBuyerToken("");
  };

  const handleSellerTokenChange = (token: string) => {
    if (sellerChain === buyerChain && token === buyerToken) {
      const differentToken = sellerTokens.find((t) => t.name !== buyerToken);
      setSellerToken(differentToken?.name || "");
    } else {
      setSellerToken(token);
    }
  };

  const handleBuyerTokenChange = (token: string) => {
    if (buyerChain === sellerChain && token === sellerToken) {
      const differentToken = buyerTokens.find((t) => t.name !== sellerToken);
      setBuyerToken(differentToken?.name || "");
    } else {
      setBuyerToken(token);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      const sellerChainId = sellerChain === "ARB" ? ChainId.ARB : ChainId.BAS;
      const buyerChainId = buyerChain === "ARB" ? ChainId.ARB : ChainId.BAS;
      const fetchedSellerTokens = await getTokensFromChain(sellerChainId);
      const fetchedBuyerTokens = await getTokensFromChain(buyerChainId);
      setSellerTokens(fetchedSellerTokens || []);
      setBuyerTokens(fetchedBuyerTokens || []);
    };

    fetchTokens();
  }, [sellerChain, buyerChain]);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      if (!sellerToken || !buyerToken || !sellerValue) return;

      const sellerTokenObj = sellerTokens.find((t) => t.name === sellerToken);
      const buyerTokenObj = buyerTokens.find((t) => t.name === buyerToken);

      if (!sellerTokenObj || !buyerTokenObj) return;

      const fetchedRoutes: any = await requestRoutes({
        fromChainId: sellerChain === "ARB" ? ChainId.ARB : ChainId.BAS,
        toChainId: buyerChain === "ARB" ? ChainId.ARB : ChainId.BAS,
        fromTokenAddress: sellerTokenObj.address,
        toTokenAddress: buyerTokenObj.address,
        fromAmount: (
          parseFloat(sellerValue) *
          10 ** sellerTokenObj.decimals
        ).toString(),
      });
      setRoutes(fetchedRoutes);
      setIsLoading(false);
      if (fetchedRoutes && fetchedRoutes[0] && fetchedRoutes[0].toAmount) {
        const toAmount =
          parseFloat(fetchedRoutes[0].toAmount) / 10 ** buyerTokenObj.decimals;
        setBuyerValue(toAmount.toFixed(6));
      }
    };

    if (sellerToken && buyerToken && sellerValue) {
      fetchRoutes();
    }
  }, [
    sellerChain,
    buyerChain,
    sellerToken,
    buyerToken,
    sellerValue,
    sellerTokens,
    buyerTokens,
  ]);

  useEffect(() => {
    if (sellerTokens.length > 0 && !sellerToken) {
      setSellerToken(sellerTokens[0].name);
    }
    if (buyerTokens.length > 0 && !buyerToken) {
      setBuyerToken(buyerTokens[0].name);
    }
  }, [sellerTokens, buyerTokens, sellerToken, buyerToken]);

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
        <SwapSlider>
          <DrawerFooter className="text-xs p-4">
            <div className="space-y-2">
              <div className="space-y-1">
                <SwapInput
                  type="seller"
                  selectedChain={sellerChain}
                  setSelectedChain={handleSellerChainChange}
                  selectedToken={sellerToken}
                  setSelectedToken={handleSellerTokenChange}
                  tokens={sellerTokens}
                  defaultValue={"ARB"}
                  value={sellerValue}
                  setValue={setSellerValue}
                  fromAmtUSD={routes?.[0]?.fromAmountUSD ?? ""}
                  isLoading={isLoading}
                />
                <SwapInput
                  type="buyer"
                  defaultValue={"BAS"}
                  selectedChain={buyerChain}
                  setSelectedChain={handleBuyerChainChange}
                  selectedToken={buyerToken}
                  setSelectedToken={handleBuyerTokenChange}
                  tokens={buyerTokens}
                  value={buyerValue}
                  setValue={(value) => setBuyerValue(value)}
                  toAmtUSD={routes?.[0]?.toAmountUSD ?? ""}
                  isLoading={isLoading}
                />
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
                    placeholder={`input%`}
                    value={
                      selectedSlippage &&
                      !["0.1", "0.5", "1"].includes(selectedSlippage)
                        ? selectedSlippage
                        : ""
                    }
                    onChange={(e) => handleSlippageChange(e.target.value)}
                    className="text-xs w-1/2 h-8 rounded-lg bg-zinc-950 border-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-between ml-2">
                <Label className="text-sm">DEX</Label>
                <CarouselNext className="flex items-center font-light text-xs h-8 w-full justify-between rounded-lg text-white bg-zinc-950">
                  <span className="flex items-center gap-1">
                    <span className="flex items-center">
                      {isLoading ? (
                        <Skeleton className="w-5 h-5 bg-gray-400 rounded-full" />
                      ) : (
                        <>
                          <img
                            src={routes?.[0]?.steps?.[0]?.toolDetails?.logoURI}
                            alt={routes?.[0]?.steps?.[0]?.toolDetails?.name}
                            className="w-5 h-5 mr-1 rounded-full border bg-gray-400"
                          />
                          {routes?.[0]?.steps?.[0]?.toolDetails?.name}
                        </>
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <p>
                      {isLoading ? (
                        <Skeleton className="w-[100px] h-2 bg-gray-400 rounded-lg" />
                      ) : (
                        <>
                          1 {routes?.[0]?.fromToken?.symbol ?? ""} ={" "}
                          {routes?.[0]?.fromAmountUSD ?? "000,000.00000000"}
                        </>
                      )}
                    </p>
                    {isLoading ? (
                      <Skeleton className="w-[80px] h-2 bg-gray-400 rounded-lg" />
                    ) : (
                      <p className="text-green-500">Best</p>
                    )}
                    <ChevronRight />
                  </span>
                </CarouselNext>
              </div>
              <div className="text-xs pt-1 ml-2">
                <dl className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <dt>Network Fee</dt>
                    <dt>
                      {isLoading ? (
                        <Skeleton className="w-[100px] h-2 bg-gray-400 rounded-lg" />
                      ) : (
                        <>
                          {routes?.[0]?.gasCostUSD
                            ? `$${parseFloat(routes[0].gasCostUSD).toFixed(4)}`
                            : ""}
                          (〜$0.0005)
                        </>
                      )}
                    </dt>
                  </div>
                  <div className="flex justify-between">
                    <dt>Protocol Fee</dt>
                    <dt>0.0000000(〜$0.0000)</dt>
                  </div>
                  <div className="flex justify-between">
                    <dt>Minimum Received</dt>
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
          <DrawerFooter className="text-xs p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {Array.isArray(routes) && routes.length > 0 ? (
                  <>
                    {routes?.map((route: any, idx: any) => (
                      <div
                        key={idx}
                        className={`h-20 w-full rounded-lg bg-zinc-950 p-4 flex flex-col justify-between text-xs ${
                          idx === 0 ? "border border-green-500" : ""
                        }`}
                      >
                        <p className="flex items-center justify-between">
                          <span className="font-bold">
                            {route.toAmount ?? "000,000.0000000"}
                          </span>
                          {idx === 0 ? (
                            <span className="text-green-500">Best</span>
                          ) : (
                            <span className="text-pink-700">-00.00%</span>
                          )}
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {route?.steps?.toolDetails?.name ?? "unknown"}{" "}
                            <LockOpen className="text-emerald-700 w-4 h-4" />
                          </span>
                          <span className="flex items-center gap-2">
                            <Fuel className="w-4 h-4" /> $
                            {route?.gasCostUSD
                              ? `${parseFloat(route?.gasCostUSD).toFixed(4)}`
                              : "0.0000"}{" "}
                            ≈ {route.afterGasFees ?? "00.0000"} after gas fees
                          </span>
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-2xl font-bold">N/A</p>
                )}
              </div>
            </ScrollArea>
          </DrawerFooter>
        </SwapSlider>
      </DrawerContent>
    </Drawer>
  );
}
