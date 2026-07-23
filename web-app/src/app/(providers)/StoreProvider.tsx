'use client'
import {persistor, store } from '@/lib/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const persistorRef = useRef(persistor);
   const storeRef  = useRef(store);

  return <Provider store={storeRef.current}>
  <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
   </PersistGate>
    </Provider>
}