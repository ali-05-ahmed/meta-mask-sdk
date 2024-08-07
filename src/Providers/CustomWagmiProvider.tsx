// CustomWagmiProvider.js
"use client";

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { WagmiProvider, createConfig as createWagmiConfig } from 'wagmi';
import { useSyncWagmiConfig } from '@lifi/wallet-management';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getWalletClient, switchChain } from '@wagmi/core';
import { mainnet, sepolia, base } from 'viem/chains';
import { ChainType, EVM, config, createConfig, getChains } from '@lifi/sdk';
import { createConnectors } from './metamaskConnector';
import { createClient, http } from 'viem';
import { useSDK } from '@metamask/sdk-react';

const queryClient = new QueryClient();

export const CustomWagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  const { provider } = useSDK();
  const [wagmiConfig, setWagmiConfig] = useState<any>(null);

  useEffect(() => {
    if (provider) {
      const connectors = createConnectors(provider);

      const config = createWagmiConfig({
        chains: [mainnet],
        multiInjectedProviderDiscovery: false,
        connectors,
        client({ chain }) {
          return createClient({ chain, transport: http() });
        },
      });

      createConfig({
        integrator: 'LiFi_Test',
        providers: [
          EVM({
            getWalletClient: () => getWalletClient(config),
            switchChain: async (chainId) => {
              const chain = await switchChain(config, { chainId });
              return getWalletClient(config, { chainId: chain.id });
            },
          }),
        ],
        // We disable chain preloading and will update chain configuration in runtime
        preloadChains: false,
      });

      setWagmiConfig(config);
    }
  }, [provider]);

  if (!wagmiConfig) {
    return null; // or a loading indicator
  }

  // Synchronize fetched chains with Wagmi config and update connectors
  // useSyncWagmiConfig(wagmiConfig, createConnectors(provider)); // add chains
  
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};