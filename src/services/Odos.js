import axios from "axios";

const ODOS_BASE_URL = "https://api.odos.xyz/";

export const COVALENT_NATIVE_TOKEN_ADDRESSES = [
  "0x0000000000000000000000000000000000001010",
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
];

const axiosInstance = axios.create({
  baseURL: ODOS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getOdosSupportedTokens = async (chainId) => {
  try {
    const res = await axiosInstance.get(`info/tokens/${chainId}`);
    const tokensList = res.data.tokenMap;
    return tokensList;
  } catch (error) {
    throw new Error(`Error fetching supported tokens for ${chainId}: ${error}`);
  }
};

export const getTokenPriceFromOdos = async (chainId, tokenAddress) => {
  try {
    const res = await axiosInstance.get(
      `pricing/token/${chainId}/${tokenAddress}`
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
  amountIn = Math.floor(amountIn);

  inputTokenAddress = normalizeAddress(inputTokenAddress);

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

  try {
    const response = await axiosInstance.post(`sor/quote/v2`, swapData);
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
    const response = await axiosInstance.post(`sor/assemble`, params);
    return response.data;
  } catch (error) {
    throw new Error(`Error assembling transaction: ${error}`);
  }
};

const normalizeAddress = (address) => {
  if (COVALENT_NATIVE_TOKEN_ADDRESSES.includes(address.toLowerCase())) {
    return "0x0000000000000000000000000000000000000000";
  } else return address;
};
