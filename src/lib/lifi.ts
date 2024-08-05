import { createConfig, ChainId, RoutesRequest } from "@lifi/sdk";
import { getRoutes } from "@lifi/sdk";
import { ethers } from "ethers";

createConfig({
  integrator: "Your dApp/company name",
  rpcUrls: {
    [ChainId.ARB]: [
      "https://arb-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
    ],
    [ChainId.BAS]: [
      "https://base-mainnet.g.alchemy.com/v2/9pd3-hYoXNIOibbfmTE0NERN0R3yKx5e",
    ],
  },
});

export const requestRoutes = async ({
  fromChainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  fromAmount,
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
  };
  const result = await getRoutes(routesRequest);
  const routes = result.routes;
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
  return [];
};

// ... existing code ...

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

// ... existing code ...

// uniSwap arb : 0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0         Decimals :18 uint8
// USDC arb    : 0xaf88d065e77c8cC2239327C5EDb3A432268e5831         Decimals :6 uint8

// DAI bas     : 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb         Decimals :18 uint8
// USDC bas    : 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913         Decimals :6 uint8
