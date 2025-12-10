import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./Compoments/ReduxSliceCart";

export const store = configureStore({
  reducer: {
    chat: chatReducer
  }
});
