import { injected } from "wagmi/connectors";

export const createConnectors = (provider: any) => [
  injected({
    target() {
      return {
        id: "windowProvider",
        name: "Window Provider",
        provider: provider,
      };
    },
  }),
];
