import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInputToken, setInputAmount } from "../store/swapSlice";
import { setBalance, setIsLoadingBalance } from "../store/walletSlice";
import { Spinner, RefreshIcon } from "../assets/icons/flowbite-icons";
import { getWalletBalances } from "../services/Covalent";

export const Balances = () => {
  const dispatch = useDispatch();
  const handleTokenClick = (token) => {
    dispatch(setInputToken(token));
  };

  const balances = useSelector((state) => state.wallet.balance);
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const chainId = useSelector((state) => state.wallet.chainId);

  const isLoadingBalance = useSelector(
    (state) => state.wallet.isLoadingBalance
  );

  const handleRefreshBalances = async () => {
    dispatch(setIsLoadingBalance(true));
    const fetchBalances = async () => {
      const balances = await getWalletBalances(walletAddress, chainId);
      dispatch(setBalance(balances));
      dispatch(setIsLoadingBalance(false));
    };
    fetchBalances();
  };

  return (
    <div className="flex flex-col gap-2 h-[350px] overflow-y-hiden w-[300px] bg-gray-800 rounded-xl p-2 border border-gray-700 shadow-md">
      <div className="flex flex-row justify-center items-center">
        <h3 className="text-2xl text-white font-bold text-center mr-2">
          Wallet Balance
        </h3>
        <div onClick={() => handleRefreshBalances()} className="cursor-pointer">
          <RefreshIcon />
        </div>
      </div>
      {isLoadingBalance ? (
        <Spinner />
      ) : (
        <div>
          <h3 className="text-md text-white font-bold text-center">
            Select Token to Swap
          </h3>
          <div className="flex flex-col gap-2 overflow-y-auto h-full">
            {balances && balances.length > 0 ? (
              balances.map((balance, index) => {
                return (
                  <div
                    className="flex flex-row px-4 py-2 justify-between items-center bg-gray-800 border border-gray-700 rounded-xl shadow-md cursor-pointer"
                    onClick={() => handleTokenClick(balance)}
                    key={index}
                  >
                    <div className="flex flex-row items-center text-white font-bold">
                      <img
                        className="h-8 w-8 rounded-xl"
                        src={balance.tokenLogo}
                        alt={`${balance.tokenSymbol} logo`}
                      />
                      <p className="mx-2">{balance.tokenSymbol}</p>
                    </div>
                    <p className="text-white font-bold">
                      {(
                        Number(balance.tokenBalance) /
                        10 ** balance.tokenDecimals
                      ).toFixed(2)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-white">
                Connect your wallet to see your balances
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
