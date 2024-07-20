import { ethers, Contract, BigNumber } from "ethers";
import { ERC20_ABI } from "./ERC20ABI";
import { COVALENT_NATIVE_TOKEN_ADDRESSES } from "../services/Odos";

const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

const RPCs = {
  1: "https://eth-pokt.nodies.app",
  137: "https://polygon.meowrpc.com",
  8453: "https://base.llamarpc.com",
  10: "https://1rpc.io/op",
  59144: "https://rpc.linea.build",
};

export const getEvmBalance = async (address, tokenAddress, chainId) => {
  const provider = ethers.providers.JsonRpcProvider(RPCs[chainId]);
  try {
    if (tokenAddress.lower() == NATIVE_TOKEN_ADDRESS.lower()) {
      balance = await provider.getBalance(address);
      formatted_balance = ethers.utils.formatEther(balance);
      return formatted_balance;
    } else {
      tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
      tokenBalance = await tokenContract.balanceOf(address);
      tokenDecimals = await tokenContract.decimals();
      formatted_balance = ethers.utils.formatUnits(tokenBalance, tokenDecimals);
    }
  } catch (error) {
    throw new Error(
      `Error fetching balance for ${address}, token ${tokenAddress}: ${error}`
    );
  }
};

export const checkAndConstructApproeTx = async (
  tokenAddress,
  spenderAddress,
  userAddress,
  chainId,
  amount
) => {
  if (
    tokenAddress === NATIVE_TOKEN_ADDRESS ||
    COVALENT_NATIVE_TOKEN_ADDRESSES.includes(tokenAddress.toLowerCase())
  ) {
    return;
  }
  let approveTx = null;
  const provider = new ethers.providers.JsonRpcProvider(RPCs[chainId]);
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const actualAllowance = await tokenContract.allowance(
    userAddress,
    spenderAddress
  );

  if (actualAllowance.lt(amount)) {
    // Add 0.5% to amount to avoid failed transactions due to rounding errors
    amount = ethers.BigNumber.from(amount).mul(1005).div(1000).toString();
    approveTx = {
      to: tokenAddress,
      data: tokenContract.interface.encodeFunctionData("approve", [
        spenderAddress,
        amount,
      ]),
      chainId: chainId,
      value: 0,
      gasLimit: 450000,
      from: userAddress,
    };
  }
  return approveTx;
};

export const awaitTxToBeMined = async (txHash, chainId) => {
  const provider = new ethers.providers.JsonRpcProvider(RPCs[chainId]);
  let receipt = await provider.getTransactionReceipt(txHash);

  const maxRetries = 10;
  const delay = 5000;

  let attempts = 0;

  while (!receipt && attempts < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    receipt = await provider.getTransactionReceipt(txHash);
    attempts++;
  }

  if (!receipt) {
    throw new Error(
      `Transaction ${txHash} not found after ${maxRetries} attempts`
    );
  }
  return receipt;
};
