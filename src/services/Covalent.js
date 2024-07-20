import axios from "axios";
import { BigNumber } from "ethers";
const API_KEY = import.meta.env.VITE_COVALENT_API_KEY;

const COVALENT_CHAIN_IDs = {
  1: "eth-mainnet",
  137: "matic-mainnet",
  8453: "base-mainnet",
  10: "optimism-mainnet",
  59144: "linea-mainnet",
  56: "bsc-mainnet",
};

export const getWalletBalances = async (address, chainId) => {
  if (!address & !address.startsWith("0x") || !chainId) return [];
  let chain = COVALENT_CHAIN_IDs[chainId];
  let userBalances = [];
  const config = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const COVALENT_ENDPOINT = `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/`;

  try {
    const res = await axios.get(COVALENT_ENDPOINT, config);
    const tokens = res.data.data.items;
    await Promise.all(
      tokens.map(async (token) => {
        if (
          ((token.supports_erc && token.supports_erc[0] === "erc20") ||
            token.native_token) &&
          token.quote_rate > 0 &&
          token.balance > 0
        ) {
          console.log("TOKEN CUMPLE", token.contract_ticker_symbol);
          userBalances.push({
            userAddress: address,
            tokenAddress: token.contract_address,
            isNative: token.native_token,
            tokenSymbol: token.contract_ticker_symbol,
            tokenDecimals: token.contract_decimals,
            tokenLogo: token.logo_urls.token_logo_url,
            tokenBalance: BigNumber.from(token.balance).toString(),
            tokenPrice: token.quote_rate,
            tokenBalanceInUSD:
              token.quote_rate *
              Number(token.balance / 10 ** token.contract_decimals),
          });
        }
      })
    );

    return userBalances;
  } catch (error) {
    throw new Error(`Error fetching wallet balances: ${error}`);
  }
};
