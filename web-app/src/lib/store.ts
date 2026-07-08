import { combineReducers, configureStore } from '@reduxjs/toolkit'
import modalReducer from '@/lib/features/modals/modalSlice'
import productsReducer from '@/lib/features/products/productsSlice'
import ordersReducer from '@/lib/features/orders/ordersSlice'
import productReducre from '@/lib/features/product/productSlice'
import dashboardReducer from '@/lib/features/dashboard/dashboardSlice'

export const store = () => {
  return configureStore({
    reducer: {
      modal:modalReducer,
      products:productsReducer,
      product:productReducre,
      dashboard:combineReducers({
        dashboard:dashboardReducer,
        orders:ordersReducer

      })
    }
  })
}

// Infer the type of store
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']