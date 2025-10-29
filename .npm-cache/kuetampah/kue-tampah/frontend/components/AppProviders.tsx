'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import { initializeReminderWatcher, useCartStore } from '@/context/CartContext';

const SERVICE_WORKER_PATH = '/sw.js';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register(SERVICE_WORKER_PATH)
      .catch(() => {
        // ignore registration failures, offline mode still works via runtime caching
      });
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CART_REMINDER_CLICKED') {
        router.push('/cart');
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initializeReminderWatcher();
    useCartStore.persist?.onFinishHydration?.(() => {
      initializeReminderWatcher();
    });
  }, []);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--brand-white)',
            color: 'var(--brand-black)',
            borderRadius: 'var(--radius-md)',
            boxShadow:
              '0 18px 36px rgba(179, 122, 76, 0.18), 0 10px 24px rgba(241, 194, 129, 0.12)',
          },
        }}
      />
    </>
  );
};
