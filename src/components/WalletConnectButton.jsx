import React, { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import {
  setChainId,
  setWalletAddress,
  setBalance,
  setIsLoadingBalance,
} from "../store/walletSlice";
import { getWalletBalances } from "../services/Covalent";
import { setAvailableTokens, setInputToken } from "../store/swapSlice";
import { getOdosSupportedTokens } from "../services/Odos";

export const WalletConnectButton = () => {
  const dispatch = useDispatch();
  const { address, chain, chainId } = useAccount();
  const isLoadingBalance = useSelector(
    (state) => state.wallet.isLoadingBalance
  );

  useEffect(() => {
    const fetchBalancesAndTokensList = async () => {
      try {
        dispatch(setIsLoadingBalance(true));

        if (address && address.startsWith("0x") && chainId) {
          const tokensPromise = getOdosSupportedTokens(chainId);
          const balancesPromise = getWalletBalances(address, chainId);

          dispatch(setWalletAddress(address));
          dispatch(setChainId(chainId));
          dispatch(setInputToken({}));

          const [tokens, balances] = await Promise.all([
            tokensPromise,
            balancesPromise,
          ]);

          dispatch(setAvailableTokens(tokens));
          dispatch(setBalance(balances));
        }
      } catch (error) {
        throw new Error(`Error fetching wallet balances: ${error}`);
      } finally {
        dispatch(setIsLoadingBalance(false));
      }
    };

    fetchBalancesAndTokensList();
  }, [address, chain, chainId, dispatch]);

  return (
    <>
      <ConnectButton chainStatus="icon" />
    </>
  );
};
