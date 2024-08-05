"use client";

import { useSDK } from "@metamask/sdk-react";
import React, { useState } from "react";
import {
  send_eth_signTypedData_v4,
  send_personal_sign,
} from "@/helpers/SignHelpers";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MetaMaskComp() {
  const [response, setResponse] = useState<unknown>("");
  const { sdk, connected, connecting, provider, chainId, account, balance } =
    useSDK();

  const languages = sdk?.availableLanguages ?? ["en"];

  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("MetaMaskSDKLng") || "en"
  );

  const changeLanguage = async (currentLanguage: string) => {
    localStorage.setItem("MetaMaskSDKLng", currentLanguage);
    window.location.reload();
  };

  const connectAndSign = async () => {
    try {
      const signResult = await sdk?.connectAndSign({
        msg: "Connect + Sign message",
      });
      setResponse(signResult);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const readOnlyCalls = async () => {
    if (!sdk?.hasReadOnlyRPCCalls() && !provider) {
      setResponse(
        "readOnlyCalls are not set and provider is not set. Please set your infuraAPIKey in the SDK Options"
      );
      return;
    }
    try {
      const result: any = await provider?.request({
        method: "eth_blockNumber",
        params: [],
      });
      const gotFrom: any = sdk?.hasReadOnlyRPCCalls()
        ? "infura"
        : "MetaMask provider";
      setResponse(`(${gotFrom}) ${result}`);
    } catch (e: any) {
      console.log(`error getting the blockNumber`, e);
      setResponse("error getting the blockNumber");
    }
  };

  const addEthereumChain = () => {
    if (!provider) {
      throw new Error(`invalid ethereum provider`);
    }

    provider
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x89",
            chainName: "Polygon",
            blockExplorerUrls: ["https://polygonscan.com"],
            nativeCurrency: { symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://polygon-rpc.com/"],
          },
        ],
      })
      .then((res) => console.log("add", res))
      .catch((e) => console.log("ADD ERR", e));
  };

  const sendTransaction = async () => {
    const to = "0x0000000000000000000000000000000000000000";
    const transactionParameters = {
      to, // Required except during contract publications.
      from: provider?.getSelectedAddress(), // must match user's active address.
      value: "0x5AF3107A4000", // Only required to send ether to the recipient from the initiating external account.
    };

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = (await provider?.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })) as string;

      setResponse(txHash);
    } catch (e) {
      console.log(e);
    }
  };

  const eth_signTypedData_v4 = async () => {
    if (!provider) {
      setResponse(`invalid ethereum provider`);
      return;
    }
    const result = await send_eth_signTypedData_v4(
      provider,
      provider.getChainId()
    );
    setResponse(result);
  };

  const eth_personal_sign = async () => {
    if (!provider) {
      setResponse(`invalid ethereum provider`);
      return;
    }
    const result = await send_personal_sign(provider);
    setResponse(result);
  };

  const terminate = () => {
    sdk?.terminate();
  };

  const changeNetwork = async (hexChainId: string) => {
    console.debug(`switching to network chainId=${hexChainId}`);
    try {
      const response = await provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }], // chainId must be in hexadecimal numbers
      });
      console.debug(`response`, response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Next js MetaMask SDK</h1>
      <div className={"Info-Status"}>
        <p>{`Connected chain: ${chainId}`}</p>
        <p>{`Connected account: ${account}`}</p>
        <p>{`Account balance: ${balance}`}</p>
        <p>{`Last request response: ${response}`}</p>
        <p>{`Connected: ${connected}`}</p>
      </div>

      <div className="sdkConfig">
        {connecting && (
          <div>Waiting for Metamask to link the connection...</div>
        )}
      </div>
      <div className="language-dropdown">
        <Label htmlFor="language-select">Language: </Label>
        <Select
          value={currentLanguage}
          defaultValue="en"
          onValueChange={setCurrentLanguage}
        >
          <SelectTrigger
            defaultValue="en"
            className="w-[100px] bg-[#1a222c] text-white"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a222c] text-white">
            <SelectGroup>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {connected ? (
        <div>
          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={connect}
          >
            Request Accounts
          </Button>

          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={eth_signTypedData_v4}
          >
            eth_signTypedData_v4
          </Button>

          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={eth_personal_sign}
          >
            personal_sign
          </Button>

          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={sendTransaction}
          >
            Send transaction
          </Button>

          {provider?.getChainId() === "0x1" ? (
            <Button
              className={"Button-Normal"}
              style={{ padding: 10, margin: 10 }}
              onClick={() => changeNetwork("0x5")}
            >
              Switch to Goerli
            </Button>
          ) : (
            <Button
              className={"Button-Normal"}
              style={{ padding: 10, margin: 10 }}
              onClick={() => changeNetwork("0x1")}
            >
              Switch to Mainnet
            </Button>
          )}

          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={() => changeNetwork("0x89")}
          >
            Switch to Polygon
          </Button>

          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={addEthereumChain}
          >
            Add Polygon Chain
          </Button>

          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={readOnlyCalls}
          >
            readOnlyCalls
          </Button>
        </div>
      ) : (
        <div>
          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={connect}
          >
            Connect
          </Button>
          <Button
            className={"Button-Normal"}
            style={{ padding: 10, margin: 10 }}
            onClick={connectAndSign}
          >
            Connect w/ Sign
          </Button>
        </div>
      )}

      <Button
        className={"Button-Danger"}
        style={{ padding: 10, margin: 10 }}
        onClick={terminate}
      >
        Terminate
      </Button>
    </div>
  );
}
