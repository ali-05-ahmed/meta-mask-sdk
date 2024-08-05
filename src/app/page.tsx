import MetaMaskComp from "@/components/MetaMaskComp";
import SelectMarket from "@/components/SelectMarket";
import Swap from "@/components/Swap";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MetaMaskComp />
      <SelectMarket />
      <Swap/>
    </main>
  );
}

