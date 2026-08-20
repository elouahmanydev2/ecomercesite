// src/store/index.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import modalReducer from '@/lib/store/features/modals/modalSlice';
import productsReducer from '@/lib/store/features/dashboard/products/productsSlice';
import ordersReducer from '@/lib/store/features/dashboard/orders/ordersSlice';
import productReducre from '@/lib/store/features/dashboard/product/productSlice';
import userProductReducre from '@/lib/store/features/product/productSlice';
import dashboardReducer from '@/lib/store/features/dashboard/dashboardSlice';
import sidebarReducer from '@/lib/store/features/dashboard/sidebar/sideBarSlice';
import analyticsReducer from '@/lib/store/features/dashboard/analytics/analyticsSlice';
import authReducer from '@/lib/store/features/(auth)/auth/authSlice';
import usersReducer from '@/lib/store/features/(users)/users/usersSlice';
import uiReducer from '@/lib/store/ui/uiSlice';

import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "./storage";
import cartReducer from '@/lib/store/features/cart/cartSlice';

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"], // only persist items, not isDrawerOpen
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth:authReducer,
    cart: persistedCartReducer,
      modal:modalReducer,
      dashboard:combineReducers({
        dashboard:dashboardReducer,
        products:productsReducer,
        product:productReducre,
        orders:ordersReducer,
        sidebar:sidebarReducer,
        analytics:analyticsReducer,
        users:usersReducer,


      }),
      user:combineReducers({
        product:userProductReducre
      }),
      ui:uiReducer,
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