'use client';

const ABANDONMENT_DELAY_MS = 15 * 60 * 1000;
export const REMINDER_STORAGE_KEY = 'kue-tampah-cart-reminder-sent';

let reminderTimeout: number | null = null;

const reminderNotification = {
  title: 'Pesanan Kue Tampah masih menunggu 🍰',
  body: 'Lanjutkan checkout sekarang sebelum slot pengiriman penuh. Ketuk untuk kembali ke keranjang.',
};

const isBrowser = () => typeof window !== 'undefined';

const getServiceWorkerRegistration = async () => {
  if (!isBrowser() || !('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration ?? (await navigator.serviceWorker.ready);
  } catch {
    return null;
  }
};

const showCartNotification = async () => {
  if (!isBrowser() || !('Notification' in window)) return false;

  if (Notification.permission === 'denied') {
    return false;
  }

  const registration = await getServiceWorkerRegistration();
  if (registration) {
    try {
      await registration.showNotification(reminderNotification.title, {
        body: reminderNotification.body,
        icon: '/favicon.ico',
        tag: 'kue-tampah-cart',
        data: { url: '/cart' },
      });
      return true;
    } catch {
      // fall back to Notification constructor
    }
  }

  try {
    new Notification(reminderNotification.title, {
      body: reminderNotification.body,
      icon: '/favicon.ico',
    });
    return true;
  } catch {
    return false;
  }
};

export const requestNotificationPermission = async () => {
  if (!isBrowser() || !('Notification' in window)) return;
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {
      // ignore
    }
  }
};

export const cancelAbandonedCartReminder = () => {
  if (reminderTimeout) {
    if (typeof window !== 'undefined') {
      window.clearTimeout(reminderTimeout);
    } else {
      clearTimeout(reminderTimeout);
    }
    reminderTimeout = null;
  }
};

export const storeReminderSent = (value: boolean) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(REMINDER_STORAGE_KEY, value ? 'true' : 'false');
};

export const scheduleAbandonedCartReminder = async ({
  lastUpdated,
  onTrigger,
  reminderAlreadySent,
}: {
  lastUpdated: number;
  onTrigger?: () => void;
  reminderAlreadySent: boolean;
}) => {
  if (!isBrowser() || reminderAlreadySent) return;

  cancelAbandonedCartReminder();

  const now = Date.now();
  const delay = Math.max(0, ABANDONMENT_DELAY_MS - (now - lastUpdated));

  const triggerReminder = async () => {
    const shown = await showCartNotification();
    if (shown) {
      storeReminderSent(true);
      onTrigger?.();
    }
  };

  if (delay === 0) {
    await triggerReminder();
    return;
  }

  reminderTimeout = window.setTimeout(() => {
    void triggerReminder();
  }, delay);
};
