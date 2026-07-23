// src/store/index.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import modalReducer from '@/lib/features/modals/modalSlice';
import productsReducer from '@/lib/features/products/productsSlice';
import ordersReducer from '@/lib/features/orders/ordersSlice';
import productReducre from '@/lib/features/product/productSlice';
import dashboardReducer from '@/lib/features/dashboard/dashboardSlice';
import sidebarReducer from '@/lib/features/dashboard/sidebar/sideBarSlice';
import analyticsReducer from '@/lib/features/dashboard/analytics/analyticsSlice'

import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "./storage";
import cartReducer from '@/lib/features/cart/cartSlice';

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"], // only persist items, not isDrawerOpen
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
      modal:modalReducer,
      products:productsReducer,
      product:productReducre,
      dashboard:combineReducers({
        dashboard:dashboardReducer,
        orders:ordersReducer,
        sidebar:sidebarReducer,
        analytics:analyticsReducer,

      }),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;