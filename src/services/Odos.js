import axios from "axios";
import { ethers } from "ethers";

const ODOS_BASE_URL = "https://api.odos.xyz/";
export const getOdosSupportedTokens = async (chainId) => {
  try {
    const res = await axios.get(`${ODOS_BASE_URL}info/tokens/${chainId}`);
    const tokensList = res.data.tokenMap;
    return tokensList;
  } catch (error) {
    throw new Error(`Error fetching supported tokens for ${chainId}: ${error}`);
  }
};

export const getTokenPriceFromOdos = async (chainId, tokenAddress) => {
  try {
    const res = await axios.get(
      `${ODOS_BASE_URL}pricing/token/${chainId}/${tokenAddress}`
    );
    return Number(res.data.price);
  } catch (error) {
    throw new Error(`Error fetching token price for ${tokenAddress}: ${error}`);
  }
};

export const getOdosQuote = async (
  inputTokenAddress,
  outputTokenAddress,
  chainId,
  amountIn,
  userAddress
) => {
  console.log(
    "GETTING ODOS QUOTE",
    inputTokenAddress,
    outputTokenAddress,
    amountIn
  );
  if (
    // Covalent may have this address for native tokens on some chains
    inputTokenAddress === "0x0000000000000000000000000000000000001010" ||
    inputTokenAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  ) {
    inputTokenAddress = "0x0000000000000000000000000000000000000000";
  }
  amountIn = Math.floor(amountIn);
  console.log("AMOUNT IN EN ODOS", amountIn);
  let swapData = JSON.stringify({
    chainId: chainId,
    inputTokens: [
      {
        tokenAddress: inputTokenAddress,
        amount: amountIn.toString(),
      },
    ],
    outputTokens: [
      {
        tokenAddress: outputTokenAddress,
        proportion: 1,
      },
    ],
    userAddr: userAddress,
    slippageLimitPercent: 3,
    sourceBlacklist: [],
    sourceWhitelist: [],
    simulate: false,
    pathViz: false,
    disableRFQs: true,
  });
  console.log("swapData", swapData);
  try {
    const response = await axios.post(
      `${ODOS_BASE_URL}sor/quote/v2`,
      swapData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const assembledTransaction = await odosAssembleTransaction(
      userAddress,
      response.data.pathId
    );

    return assembledTransaction;
  } catch (error) {
    throw new Error(`Error fetching quote: ${error}`);
  }
};

export const odosAssembleTransaction = async (walletAddress, pathId) => {
  const params = {
    userAddr: walletAddress,
    pathId: pathId,
    simulate: false,
  };

  try {
    const response = await axios.post(`${ODOS_BASE_URL}sor/assemble`, params, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error assembling transaction: ${error}`);
  }
};
