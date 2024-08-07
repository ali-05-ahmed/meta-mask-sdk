export type InputType = "seller" | "buyer";

export type Token = {
  name: string;
  decimals: number;
  logo: string;
  address: string;
};

export type SwapInputProps = {
  type: InputType;
  selectedChain: "ARB" | "BAS";
  setSelectedChain: (chain: "ARB" | "BAS") => void;
  selectedToken: string;
  setSelectedToken: (token: string) => void;
  tokens: Token[];
  defaultValue: "ARB" | "BAS";
  value: string | number;
  setValue: (value: any) => void;
  fromAmtUSD?: string;
  toAmtUSD?: string;
  balance?: string;
  isLoading: boolean;
};


export type Chains = "ARB" | "BAS";

