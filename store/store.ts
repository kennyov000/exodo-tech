import { configureStore } from "@reduxjs/toolkit";
import { exodoApi } from "./api/exodoApi";
import authReducer from "./slices/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [exodoApi.reducerPath]: exodoApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(exodoApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
