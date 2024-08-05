"use client";

import React from "react";
import { MetaMaskProvider } from "@metamask/sdk-react";

const openDeeplink = (link: string) => {
  const canOpenLink = true;
  if (canOpenLink) {
    window.open(link, "_blank");
  }
};

export default function MetaMaskWeb3({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        logging: {
          developerMode: false,
        },
        communicationServerUrl: "https://metamask-sdk.api.cx.metamask.io/",
        checkInstallationImmediately: false,
        i18nOptions: {
          enabled: true,
        },
        useDeeplink: true,
        openDeeplink: openDeeplink,
        dappMetadata: {
          name: "Demo React App",
          url: window.location.protocol + "//" + window.location.host,
        },
      }}
    >
      {children}
    </MetaMaskProvider>
  );
}
