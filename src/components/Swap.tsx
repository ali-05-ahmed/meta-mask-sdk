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
import {
  checkUserBalance,
  getTokensFromChain,
  requestRoutes,
  userBalance,
} from "@/lib/lifi";
import { ChainId } from "@lifi/sdk";
import { Skeleton } from "./ui/skeleton";
import SwapSlider from "./SwapSlider";
import { CarouselNext } from "./ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  calculateTotalAmountUSD,
  calculateTotalGasCost,
  formatValue,
  getShortWords,
} from "@/lib/utils";
import { Chains, Token } from "@/types/types";
import { useAccount, useBalance } from "wagmi";

export default function Swap() {
  const [selectedSlippage, setSelectedSlippage] = useState<string>("0.1");
  const [routes, setRoutes] = useState<any>(null);
  const [sellerChain, setSellerChain] = useState<Chains>("ARB");
  const [buyerChain, setBuyerChain] = useState<Chains>("BAS");
  const [sellerToken, setSellerToken] = useState<string>("");
  const [buyerToken, setBuyerToken] = useState<string>("");
  const [sellerTokens, setSellerTokens] = useState<Token[]>([]);
  const [buyerTokens, setBuyerTokens] = useState<Token[]>([]);
  const [sellerValue, setSellerValue] = useState<string>("");
  const [buyerValue, setBuyerValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isSwapDisabled, setIsSwapDisabled] = useState(true);
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance();
  const RouteIsNull =
    routes?.[selectedRouteIndex] === undefined ||
    routes?.[selectedRouteIndex] === null;
  const selectedRoute = routes?.[selectedRouteIndex];
  const allFeeCosts =
    selectedRoute?.steps.flatMap((step: any) => step.estimate.feeCosts) || [];
  const totalAmountUSD = calculateTotalAmountUSD(allFeeCosts);

  const getChainId = (chain: Chains): ChainId => {
    switch (chain) {
      case "ARB":
        return ChainId.ARB;
      case "BAS":
        return ChainId.BAS;
      case "POL":
        return ChainId.POL;
      default:
        throw new Error("Unsupported chain");
    }
  };

  const handleClick = () => {
    console.log(selectedRoute);
  };

  const handleSlippageChange = (value: string) => {
    setSelectedSlippage(value);
    console.log("Slippage changed to:", value);
  };

  const handleCustomSlippageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      return;
    }
    setCustomSlippage(value);
    setSelectedSlippage(value);
  };

  const handleSellerChainChange = (newChain: Chains) => {
    setSellerChain(newChain);
    setSellerToken("");
  };

  const handleBuyerChainChange = (newChain: Chains) => {
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

  useEffect(() => {
    if (!isConnected) {
      setIsSwapDisabled(true);
      setButtonText("Connect Wallet");
    } else if (RouteIsNull) {
      setIsSwapDisabled(true);
      setButtonText("No Route Available");
    } else if (isLoading) {
      setIsSwapDisabled(true);
      setButtonText("Loading...");
    } else {
      setIsSwapDisabled(false);
      setButtonText("Swap");
    }
  }, [isConnected, RouteIsNull, isLoading]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        console.log("User chain balance", await userBalance(address, 10));
      }
    };
    fetchBalance();
  }, [address]);

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
      const sellerChainId = getChainId(sellerChain);
      const buyerChainId = getChainId(buyerChain);
      const fetchedSellerTokens: any = await getTokensFromChain(sellerChainId);
      const fetchedBuyerTokens: any = await getTokensFromChain(buyerChainId);
      setSellerTokens(fetchedSellerTokens || []);
      setBuyerTokens(fetchedBuyerTokens || []);
    };

    fetchTokens();
  }, [sellerChain, buyerChain]);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      if (!sellerToken || !buyerToken || !sellerValue) {
        setIsLoading(false);
        setBuyerValue("0");
        return;
      }

      const sellerTokenObj = sellerTokens.find((t) => t.name === sellerToken);
      const buyerTokenObj = buyerTokens.find((t) => t.name === buyerToken);

      if (!sellerTokenObj || !buyerTokenObj) {
        setIsLoading(false);
        return;
      }

      const slippageValue = parseFloat(selectedSlippage) / 100;
      console.log("Sending slippage value:", slippageValue);

      const fetchedRoutes = await requestRoutes({
        fromChainId: getChainId(sellerChain),
        toChainId: getChainId(buyerChain),
        fromTokenAddress: sellerTokenObj.address,
        toTokenAddress: buyerTokenObj.address,
        fromAmount: (
          parseFloat(sellerValue) *
          10 ** sellerTokenObj.decimals
        ).toString(),
        options: {
          slippage: slippageValue,
        },
      });

      setRoutes(fetchedRoutes);
      setIsLoading(false);

      if (fetchedRoutes && fetchedRoutes[0] && fetchedRoutes[0].toAmount) {
        const toAmount =
          parseFloat(fetchedRoutes[0].toAmount) / 10 ** buyerTokenObj.decimals;
        setBuyerValue(toAmount.toFixed(6));
      } else {
        setBuyerValue("0");
      }
    };

    fetchRoutes();
    const intervalId = setInterval(fetchRoutes, 40000);
    return () => clearInterval(intervalId);
  }, [
    sellerChain,
    buyerChain,
    sellerToken,
    buyerToken,
    sellerValue,
    sellerTokens,
    buyerTokens,
    selectedSlippage,
  ]);

  useEffect(() => {
    if (sellerTokens.length > 0 && !sellerToken) {
      setSellerToken(sellerTokens[0].name);
    }
    if (buyerTokens.length > 0 && !buyerToken) {
      setBuyerToken(buyerTokens[0].name);
    }
  }, [sellerTokens, buyerTokens, sellerToken, buyerToken]);

  useEffect(() => {
    if (
      routes &&
      routes[selectedRouteIndex] &&
      routes[selectedRouteIndex].toAmount
    ) {
      const buyerTokenObj = buyerTokens.find((t) => t.name === buyerToken);
      if (buyerTokenObj) {
        const toAmount =
          parseFloat(routes[selectedRouteIndex].toAmount) /
          10 ** buyerTokenObj.decimals;
        setBuyerValue(toAmount.toFixed(6));
      }
    }
  }, [routes, selectedRouteIndex, buyerToken, buyerTokens]);

  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <Button className="w-full btn-gradient text-white">Swap</Button>
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
                  fromAmtUSD={selectedRoute?.fromAmountUSD ?? ""}
                  isLoading={isLoading}
                  //balance={userBalance(address, fromChainID)}
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
                  toAmtUSD={selectedRoute?.toAmountUSD ?? ""}
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
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippageChange(e.target.value)}
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
                            src={
                              selectedRoute?.steps?.[0]?.toolDetails?.logoURI
                            }
                            alt={selectedRoute?.steps?.[0]?.toolDetails?.name}
                            className="w-5 h-5 mr-1 rounded-full border bg-gray-400"
                          />
                          {getShortWords(
                            selectedRoute?.steps?.[0]?.toolDetails?.name
                          )}
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
                          1 {selectedRoute?.toToken?.symbol ?? ""} ={" "}
                          {selectedRoute?.toAmountUSD ?? "000,000.00000000"}
                        </>
                      )}
                    </p>
                    {isLoading ? (
                      <Skeleton className="w-[80px] h-2 bg-gray-400 rounded-lg" />
                    ) : (
                      <p className="text-green-500">
                        {selectedRouteIndex === 0 ? "Best" : ""}
                      </p>
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
                          {selectedRoute?.gasCostUSD
                            ? `$${parseFloat(
                                routes[selectedRouteIndex].gasCostUSD
                              ).toFixed(4)}`
                            : ""}
                          (〜$0.0005)
                        </>
                      )}
                    </dt>
                  </div>
                  <div className="flex justify-between">
                    <dt>Protocol Fee</dt>
                    <dt>
                      {isLoading ? (
                        <Skeleton className="w-[100px] h-2 bg-gray-400 rounded-lg" />
                      ) : (
                        <>
                          {calculateTotalGasCost(selectedRoute)}(〜$
                          {totalAmountUSD.toFixed(2)})
                        </>
                      )}
                    </dt>
                  </div>
                  <div className="flex justify-between">
                    <dt>Minimum Received</dt>
                    <dt>
                      {isLoading ? (
                        <Skeleton className="w-[100px] h-2 bg-gray-400 rounded-lg" />
                      ) : (
                        <>
                          {selectedRoute?.toAmountUSD ?? "000.00"}{" "}
                          {selectedRoute?.toToken?.symbol ?? ""}
                        </>
                      )}
                    </dt>
                  </div>
                </dl>
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <Button
                className="btn-gradient text-white"
                onClick={handleClick}
                disabled={isSwapDisabled}
              >
                {buttonText}
              </Button>
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
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-20 w-full rounded-lg bg-zinc-950 p-4 flex flex-col justify-between"
                      >
                        <Skeleton className="w-1/2 h-4 bg-gray-400 rounded" />
                        <div className="flex justify-between">
                          <Skeleton className="w-1/3 h-4 bg-gray-400 rounded" />
                          <Skeleton className="w-1/3 h-4 bg-gray-400 rounded" />
                        </div>
                      </div>
                    ))
                ) : Array.isArray(routes) && routes.length > 0 ? (
                  routes.map((route: any, idx: number) => (
                    <div
                      key={idx}
                      className={`h-20 w-full rounded-lg bg-zinc-950 p-4 flex flex-col justify-between text-xs cursor-pointer ${
                        idx === selectedRouteIndex
                          ? "border border-green-500"
                          : ""
                      }`}
                      onClick={() => setSelectedRouteIndex(idx)}
                    >
                      <p className="flex items-center justify-between">
                        <span className="font-bold">
                          {formatValue(route.toAmount, 18) ?? "000,000.0000000"}{" "}
                          {route.toToken?.symbol}
                        </span>
                        {idx === 0 ? (
                          <span className="text-green-500">Best</span>
                        ) : (
                          <span className="text-pink-700">-000.00%</span>
                        )}
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <img
                            src={route?.steps?.[0]?.toolDetails?.logoURI}
                            alt={route?.steps?.[0]?.toolDetails?.name}
                            className="w-4 h-4 rounded-full border bg-gray-400"
                          />
                          {getShortWords(route?.steps?.[0]?.toolDetails?.name)}{" "}
                          <LockOpen className="text-emerald-700 w-4 h-4" />
                        </span>
                        <span className="flex items-center gap-2">
                          <Fuel className="w-4 h-4" />
                          $0.0000 ≈ 00.0000 after gas fees
                        </span>
                      </p>
                    </div>
                  ))
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
