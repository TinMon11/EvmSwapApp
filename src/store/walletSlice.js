import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    chainId: 137,
    isLoadingBalance: false,
    balance: [],
    walletAddress: "",
  },
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setChainId: (state, action) => {
      state.chainId = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setIsLoadingBalance: (state, action) => {
      state.isLoadingBalance = action.payload;
    },
  },
});

export const { setBalance, setChainId, setWalletAddress, setIsLoadingBalance } = walletSlice.actions;

export default walletSlice.reducer;
