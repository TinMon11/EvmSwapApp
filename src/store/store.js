import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import swapReducer from "./swapSlice";

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    swap: swapReducer,
  },
});

export default store;
