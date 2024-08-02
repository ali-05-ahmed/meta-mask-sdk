import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MetaMaskProvider } from "@metamask/sdk-react";

const openDeeplink = (link: string) => {
  // You might want to implement your own logic here
  // to determine if the link can be opened
  const canOpenLink = true; // This should be determined based on your app's logic

  if (canOpenLink) {
    // Use window.open for web environments
    window.open(link, "_blank");
  }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);
