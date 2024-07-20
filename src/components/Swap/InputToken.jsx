import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInputAmount, setIsLoadingQuote } from "../../store/swapSlice";

export const InputToken = ({ token }) => {
  const dispatch = useDispatch();

  const [tokenAmount, setTokenAmount] = useState(
    (token.tokenBalance / 10 ** token.tokenDecimals).toFixed(2)
  );

  useEffect(() => {
    setTokenAmount((token.tokenBalance / 10 ** token.tokenDecimals).toFixed(2));
    dispatch(setInputAmount(token.tokenBalance));
  }, [token]);

  const handleClickAmount = (amount) => {
    console.log("HANDLE CLICK AMOUNT", amount.toFixed(token.tokenDecimals));
    console.log(
      "PARSEADO",
      Math.floor(
        amount.toFixed(token.tokenDecimals) * 10 ** token.tokenDecimals
      )
    );
    setTokenAmount(amount.toFixed(token.tokenDecimals));
    dispatch(
      setInputAmount(
        Math.floor(
          amount.toFixed(token.tokenDecimals) * 10 ** token.tokenDecimals
        )
      )
    );
  };

  const handleInputChange = (e) => {
    dispatch(setIsLoadingQuote(true));
    const value = e.target.value;
    setTokenAmount(value);
    const parsedAmount = Math.floor(Number(value) * 10 ** token.tokenDecimals);
    dispatch(setInputAmount(parsedAmount));
  };

  return (
    <div className="flex flex-row w-full items-center px-4 py-2 rounded-xl text-white bg-gray-900 border border-gray-700 shadow-md">
      <div className="flex flex-row items-center gap-2">
        {token.tokenLogo && (
          <img src={token.tokenLogo} className="w-8 h-8 rounded-xl" />
        )}
        <p className="text-xl font-bold">
          {token.tokenSymbol ?? "Select Token"}
        </p>
      </div>
      <div className="flex flex-col items-end w-full">
        <div className="flex flex-row gap-2">
          <button
            onClick={() =>
              handleClickAmount(token.tokenBalance / 10 ** token.tokenDecimals)
            }
            className="px-2 rounded-xl text-xs bg-gray-700 text-gray-200"
          >
            MAX
          </button>
          <button
            onClick={() =>
              handleClickAmount(
                Math.floor(token.tokenBalance / 2) / 10 ** token.tokenDecimals
              )
            }
            className="px-2 rounded-xl text-xs bg-gray-700 text-gray-200"
          >
            HALF
          </button>
        </div>

        <input
          type="number"
          className="no-spinner w-3/4 p-2 rounded-xl text-2xl text-right bg-gray-900 text-white"
          placeholder="0"
          min="0"
          value={tokenAmount}
          onChange={handleInputChange}
        />
        <p className="text-xs text-gray-400 mr-2">
          ${(tokenAmount * token.tokenPrice).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
