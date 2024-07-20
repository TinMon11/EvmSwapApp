import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, linea, base, bsc } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

export const WagmiConfig = getDefaultConfig({
  appName: "evm-swap-tinmon11",
  projectId: "094f15bf8090b7092701d64b3e7b90a6",
  chains: [polygon, base, bsc, mainnet, optimism, linea],
  ssr: true,
});

export const queryClient = new QueryClient();
