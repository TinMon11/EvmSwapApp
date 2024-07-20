import { createSlice } from "@reduxjs/toolkit";

export const swapSlice = createSlice({
  name: "swap",
  initialState: {
    inputToken: {},
    outputToken: {},
    inputAmount: 0,
    outputAmount: 0,
    availableTokens: [],
    isLoadingQuote: false,
    swapTx: null,
  },
  reducers: {
    setInputToken: (state, action) => {
      state.inputToken = action.payload;
      state.inputAmount = action.payload.tokenBalance;
    },
    setOutputToken: (state, action) => {
      state.outputToken = action.payload;
    },
    setAvailableTokens: (state, action) => {
      state.availableTokens = action.payload;
    },
    setInputAmount: (state, action) => {
      state.inputAmount = action.payload;
      state.isLoadingQuote = false;
    },
    setSwapTx: (state, action) => {
      state.swapTx = action.payload;
    },
    setIsLoadingQuote: (state, action) => {
      state.isLoadingQuote = action.payload;
    },
  },
});

export const {
  setInputToken,
  setOutputToken,
  setAvailableTokens,
  setInputAmount,
  setIsLoadingQuote,
  setSwapTx,
} = swapSlice.actions;

export default swapSlice.reducer;
