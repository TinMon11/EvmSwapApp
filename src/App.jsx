import "./App.css";
import { queryClient, WagmiConfig } from "./services/RainbowKit";
import { Header } from "./components/Header";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { Footer } from "./components/Footer";
import { SwapModal } from "./components/Swap/SwapModal";
import { Provider } from "react-redux";
import store from "./store/store";
import { Balances } from "./components/Balances";

export const App = () => {
  return (
    <Provider store={store}>
      <WagmiProvider config={WagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            <>
              <div className="flex flex-col justify-between h-lvh items-center bg-gray-900">
                <Header />
                <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                  <Balances />
                  <SwapModal />
                </div>
                <Footer />
              </div>
            </>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
};
