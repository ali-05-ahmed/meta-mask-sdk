import MetaMaskComp from "@/components/MetaMaskComp";
import SelectMarket from "@/components/SelectMarket";
import Swap from "@/components/Swap";
import { Skeleton } from "@/components/ui/skeleton";
import { requestRoutes } from "@/lib/lifi";

export default async function Home() {
  // const fetchedRoutes: any = await requestRoutes({
  //   fromChainId: 42161, // Arbitrum
  //   toChainId: 10, // Optimism
  //   fromTokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
  //   toTokenAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // DAI on Optimism
  //   fromAmount: "10000000", // 10 USDC
  // });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MetaMaskComp />
      <SelectMarket />
      <Swap />
    </main>
  );
}
