'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { initializeApp } from '../store/appSlice';
import { useAppDispatch, useAppSelector } from '../store/store';

// Global flag to prevent double initialization in development
let isInitialized = false;

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isInitialized: authReady } = useAppSelector((state) => state.app.auth);

  useEffect(() => {
    if (!isInitialized) {
      isInitialized = true;
      dispatch(initializeApp());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
