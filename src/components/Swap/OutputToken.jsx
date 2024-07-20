import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOdosQuote } from "../../services/Odos";
import { setSwapTx } from "../../store/swapSlice";
import { Spinner } from "../../assets/icons/flowbite-icons";

export const OutputToken = () => {
  const dispatch = useDispatch();

  const [outputToken, setOutputToken] = useState(null);
  const [outputInUsd, setOutputInUsd] = useState(null);
  const [outputAmount, setOutputAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const tokens = useSelector((state) => state.swap.availableTokens);
  const chainId = useSelector((state) => state.wallet.chainId);
  const inputToken = useSelector((state) => state.swap.inputToken);
  const inputAmount = useSelector((state) => state.swap.inputAmount);
  const userAddress = useSelector((state) => state.wallet.walletAddress);

  useEffect(() => {
    let tokenKeys = Object.keys(tokens);
    if (tokenKeys.length > 0) {
      setOutputToken({ ...tokens[tokenKeys[0]], tokenAddress: tokenKeys[0] });
    }
  }, [tokens]);

  useEffect(() => {
    if (
      !inputToken.tokenAddress ||
      inputToken.tokenSymbol === outputToken?.symbol
    ) {
      setOutputAmount(null);
      dispatch(setSwapTx(null));
      return;
    }

    const getOutputAmount = async () => {
      setIsLoading(true);
      if (inputToken && outputToken && inputAmount) {
        const odosQuote = await getOdosQuote(
          inputToken.tokenAddress,
          outputToken.tokenAddress,
          chainId,
          Math.floor(inputAmount),
          userAddress
        );

        const outputAmount = Number(
          odosQuote.outputTokens[0].amount / 10 ** outputToken.decimals
        );

        setOutputAmount(outputAmount);
        setOutputInUsd(
          Number(odosQuote.netOutValue) > 0 ? Number(odosQuote.netOutValue) : 0
        );
        dispatch(setSwapTx(odosQuote.transaction));
      }
      setIsLoading(false);
    };

    getOutputAmount();
  }, [inputToken, outputToken, inputAmount]);

  const handleTokenChange = async (e) => {
    const newOutputToken = {
      ...tokens[e.target.value],
      tokenAddress: e.target.value,
    };
    setOutputToken(newOutputToken);
  };

  return (
    <div className="flex flex-row w-full items-center px-2 py-2 rounded-xl text-white bg-gray-900 border border-gray-700">
      <div className="flex flex-row items-center gap-2 w-full">
        <select
          value={outputToken?.tokenAddress || "--"}
          onChange={handleTokenChange}
          className="bg-gray-900 hover:bg-gray-800 py-2 pl-2 text-white rounded-xl text-xl font-bold w-full"
        >
          {Object.keys(tokens).map((key) => (
            <option key={key} value={key}>
              {tokens[key].symbol}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-end w-full">
        <p className="text-xs text-gray-400 px-2 text-right">Est. Output</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <p className="py-2 rounded-xl text-2xl bg-gray-900 text-white mr-2">
              {outputAmount ? outputAmount.toFixed(6) : "--"}
            </p>
            <p className="text-xs text-gray-400 mr-2">
              ${outputInUsd ? outputInUsd.toFixed(2) : "--"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
