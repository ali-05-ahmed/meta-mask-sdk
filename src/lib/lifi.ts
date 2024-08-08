import {
  createConfig,
  ChainId,
  RoutesRequest,
  getTokenAllowance,
  getChains,
} from "@lifi/sdk";
import { getRoutes } from "@lifi/sdk";
import { getWalletClient } from "@wagmi/core";
import { log } from "console";
import { ethers } from "ethers";
import { LogOut } from "lucide-react";
import { http, createPublicClient, extractChain, formatUnits } from "viem";
import * as chains from "viem/chains";

createConfig({
  integrator: "Your dApp/company name",
  rpcUrls: {
    [ChainId.ARB]: [
      "https://arb-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
    ],
    [ChainId.BAS]: [
      "https://base-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
    ],
    [ChainId.POL]: [
      "https://polygon-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
    ],
  },
});

let fuelChainsID = [ChainId.ETH, ChainId.POL];

export const requestRoutes = async ({
  fromChainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  fromAmount,
  options,
}: any) => {
  createConfig({
    integrator: "lifitest",
    rpcUrls: {
      [ChainId.ARB]: [
        "https://arb-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
      ],
      [ChainId.BAS]: [
        "https://base-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
      ],
      [ChainId.POL]: [
        "https://polygon-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
      ],
    },
  });

  const routesRequest = {
    fromChainId,
    toChainId,
    fromTokenAddress,
    toTokenAddress,
    // fromAmount: ethers.parseUnits(
    //   fromAmount.toString(),
    //   getTokenDecimalsFromChain(fromChainId, fromTokenAddress).toString()
    // ),
    fromAmount,

    options: {
      slippage: options?.slippage || 0.001,
    },
  };
  let routes: any;
  try {
    const result = await getRoutes(routesRequest);
    routes = result.routes;
  } catch (error) {
    routes = [];
  }
  console.log(routes);
  return routes;
};

export const getTokensFromChain = (_ChainId: any) => {
  //For testing purpose

  if (_ChainId === ChainId.ARB) {
    return [
      {
        name: "UNI",
        decimals: 18,
        logo: "/uniswap.png",
        address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
      },
      {
        name: "USDC",
        decimals: 6,
        logo: "/usdc.webp",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
    ];
  }
  if (_ChainId === ChainId.BAS) {
    return [
      {
        name: "DAI",
        decimals: 18,
        logo: "/dai.png",
        address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      },
      {
        name: "USDC",
        decimals: 6,
        logo: "/usdc.webp",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
    ];
  }
  if (_ChainId === ChainId.POL) {
    return [
      {
        name: "MATIC",
        decimals: 18,
        logo: "/matic.svg",
        address: "0x0000000000000000000000000000000000000000",
      },
      {
        name: "USDC",
        decimals: 6,
        logo: "/usdc.webp",
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      },
    ];
  }
  return [];
};

const getTokenDecimalsFromChain = (chainId: any, tokenAddress: any): any => {
  const tokens = getTokensFromChain(chainId);

  if (!tokens) {
    return undefined;
  }

  const token = tokens.find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  return token?.decimals;
};

export const FuelchainCompatibility = (toChainId: any, fromChainId: any) => {
  if (fuelChainsID.includes(toChainId) && fuelChainsID.includes(fromChainId)) {
    return true;
  }
  return false;
};

export const checkUserBalance = async (
  address: any,
  fromChainId: any,
  toChainId: any,
  // fromTokenAddress: any,
  // fromAmount: any,
  toGas: any,
  fromGas: any
) => {
  const fromViemChain = extractChain({
    chains: Object.values(chains),
    id: fromChainId,
  });

  let publicClient = createPublicClient({
    chain: fromViemChain,
    transport: http(),
  });

  const fromChainBalance = await publicClient.getBalance({
    address: address,
  });
  console.log("BALANCE ===>", fromChainBalance);
  if (fromChainBalance < fromGas) {
    return false;
  }
  let result = {
    fromGas: true,
    toGas: false,
  };

  const toViemChain = extractChain({
    chains: Object.values(chains),
    id: toChainId,
  });

  let toPublicClient = createPublicClient({
    chain: toViemChain,
    transport: http(),
  });

  const toChainBalance = await toPublicClient.getBalance({
    address: address,
  });
  if (toChainBalance > toGas) {
    result.toGas = true;
  }
  console.log("BALANCE ===>", toChainBalance, fromChainBalance);
  return result;
};

export const userBalance = async (address: any, chainId: any) => {
  const fromViemChain = extractChain({
    chains: Object.values(chains),
    id: chainId,
  });
  let publicClient = createPublicClient({
    chain: fromViemChain,
    transport: http(),
  });

  const fromChainBalance = await publicClient.getBalance({
    address: address,
  });
  let decimals = fromViemChain.nativeCurrency.decimals;
  let formattedBalance = formatUnits(fromChainBalance, decimals);
  return formattedBalance;
};
