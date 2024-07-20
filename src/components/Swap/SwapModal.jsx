import React, { useEffect } from "react";
import { InputToken } from "./InputToken";
import { OutputToken } from "./OutputToken";
import { SwapIcon } from "../../assets/icons/flowbite-icons";
import { useDispatch, useSelector } from "react-redux";
import { setInputToken, setOutputToken } from "../../store/swapSlice";
import { useSendTransaction } from "wagmi";
import "react-toastify/dist/ReactToastify.css";
import { BigNumber } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import {
  awaitTxToBeMined,
  checkAndConstructApproeTx,
} from "../../utils/EvmFunctions";
import { setBalance } from "../../store/walletSlice";
import { getWalletBalances } from "../../services/Covalent";

const blockExplorersUrls = {
  137: "https://polygonscan.com",
  56: "https://bscscan.com",
  1: "https://etherscan.io",
  10: "https://optimistic.etherscan.io",
  8453: "https://basescan.org",
};

const toastMessage = (
  <>
    Transaction Sent.
    <br />
    👉 Click to View on BlockExplorer
  </>
);

export const SwapModal = () => {
  const { sendTransactionAsync } = useSendTransaction();

  const dispatch = useDispatch();

  const tokenA = useSelector((state) => state.swap.inputToken);
  const tokenB = useSelector((state) => state.swap.outputToken);
  const inputAmount = useSelector((state) => state.swap.inputAmount);
  const swapTx = useSelector((state) => state.swap.swapTx);
  const walletAddress = useSelector((state) => state.wallet.walletAddress);

  const [isSwapping, setIsSwapping] = React.useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = React.useState(false);

  useEffect(() => {
    if (!tokenA.tokenBalance || !inputAmount) return;

    if (
      BigNumber.from(tokenA.tokenBalance.toString()).gte(
        BigNumber.from(inputAmount.toString())
      )
    ) {
      setHasEnoughBalance(true);
      return;
    }
    setHasEnoughBalance(false);
  }, [tokenA, inputAmount]);

  const handleSwapIconClick = () => {
    dispatch(setInputToken(tokenB));
    dispatch(setOutputToken(tokenA));
  };

  const handleSwap = async () => {
    setIsSwapping(true);
    try {
      let swapTxToSign = swapTx;
      const approveTx = await checkAndConstructApproeTx(
        tokenA.tokenAddress,
        swapTx.to,
        swapTx.from,
        swapTx.chainId,
        inputAmount
      );

      let approveTxResult = { status: 1 }; // default to success
      if (approveTx) {
        const approveHash = await sendTransactionAsync(approveTx);
        approveTxResult = await awaitTxToBeMined(
          approveHash,
          approveTx.chainId
        );
        swapTxToSign = {
          ...swapTxToSign,
          nonce: swapTxToSign.nonce + 1,
        };
      }
      if (approveTxResult.status !== 1) {
        toast.error("Error while approving swap router");
        return;
      }
      const swapHash = await sendTransactionAsync(swapTxToSign);
      const swapTxResult = await awaitTxToBeMined(swapHash, swapTx.chainId);
      if (swapTxResult.status !== 1) {
        toast.error("Error while swapping tokens");
        return;
      }
      const explorerUrl = blockExplorersUrls[swapTxToSign.chainId];
      const linkToExplorer = `${explorerUrl}/tx/${swapHash}`;

      toast.success(toastMessage, {
        onClick: () => window.open(linkToExplorer, "_blank"),
      });

      const balances = await getWalletBalances(
        walletAddress,
        swapTxToSign.chainId
      );

      dispatch(setBalance(balances));
    } catch (error) {
      toast.error("Error sending transaction");
    }
    setIsSwapping(false);
  };

  return (
    <div className="border border-gray-700 flex flex-col justify-between items-center h-[350px] w-[350px] bg-gray-800 p-4 gap-2 rounded-xl">
      <InputToken token={tokenA} />
      <div onClick={handleSwapIconClick} className="cursor-pointer">
        <SwapIcon />
      </div>
      <OutputToken token={tokenB} inputToken={tokenA} />
      <button
        disabled={isSwapping || !swapTx || !hasEnoughBalance}
        onClick={handleSwap}
        className={`w-full font-bold p-4 rounded-xl bg-[#F16600] text-white border border-[#F19900] hover:bg-[#F19900] hover:border-[#F16600]
          ${isSwapping ? "animate-pulse" : ""}
          `}
      >
        {!hasEnoughBalance
          ? "Insufficient Balance"
          : isSwapping
          ? "Swapping..."
          : "Swap"}
      </button>
      <ToastContainer
        style={{ width: "400px" }}
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        transition:Bounce
      />
    </div>
  );
};
