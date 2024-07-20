import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setInputAmount, setIsLoadingQuote } from "../../store/swapSlice";
import { useDebounce } from "../../hooks/useDebounce";

export const InputToken = ({ token }) => {
  const dispatch = useDispatch();
  const [tokenAmount, setTokenAmount] = useState(
    (token.tokenBalance / 10 ** token.tokenDecimals).toFixed(2)
  );
  const [input, setInput] = useState(tokenAmount);
  const debouncedInputAmount = useDebounce(input, 600);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    setTokenAmount((token.tokenBalance / 10 ** token.tokenDecimals).toFixed(2));
    dispatch(setInputAmount(token.tokenBalance));
  }, [token]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    dispatch(setIsLoadingQuote(true));
    const parsedAmount = Math.floor(
      Number(debouncedInputAmount) * 10 ** token.tokenDecimals
    );
    dispatch(setInputAmount(parsedAmount));

    return () => {
      abortController.abort();
    };
  }, [debouncedInputAmount, dispatch, token.tokenDecimals]);

  const handleClickAmount = (amount) => {
    const formattedAmount = amount.toFixed(token.tokenDecimals);
    const parsedAmount = Math.floor(
      formattedAmount * 10 ** token.tokenDecimals
    );
    setTokenAmount(formattedAmount);
    setInput(formattedAmount);
    dispatch(setInputAmount(parsedAmount));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTokenAmount(value);
    setInput(value);
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
