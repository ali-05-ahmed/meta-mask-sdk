import MetaMaskComp from "@/components/MetaMaskComp";
import SelectMarket from "@/components/SelectMarket";
import Swap from "@/components/Swap";

export default async function Home() {
  return (
    <main className="p-24 space-y-4">
      <MetaMaskComp />
      {/* <SelectMarket /> */}
      <Swap />
    </main>
  );
}
