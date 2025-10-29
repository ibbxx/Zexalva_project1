'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

import { useCart } from '@/context/CartContext';

export const FloatingCart = () => {
  const { items } = useCart();
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <motion.div
      className="fixed bottom-8 right-6 z-40"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
    >
      <Link
        href="/cart"
        className="relative inline-flex items-center gap-3 rounded-full bg-[var(--brand-brown-500)] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[var(--brand-brown-700)]"
      >
        <ShoppingCart size={18} />
        Keranjang
        <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-[var(--brand-brown-700)]">
          {itemCount}
        </span>
      </Link>
    </motion.div>
  );
};
