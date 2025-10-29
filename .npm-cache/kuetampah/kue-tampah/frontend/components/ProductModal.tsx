'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { X, Sparkles, ShoppingBag } from 'lucide-react';

import { formatCurrency } from '@/lib/currency';
import { Product } from '@/lib/products';

type ProductModalProps = {
  product: Product;
  open: boolean;
  quantity: number;
  onClose: () => void;
  onAdd: () => void;
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
  exit: { opacity: 0, y: 60, scale: 0.95, transition: { duration: 0.2 } },
};

export const ProductModal = ({ product, open, quantity, onClose, onAdd }: ProductModalProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={onClose}
      >
        <motion.div
          className="mx-4 flex w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-2xl md:flex-row"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative h-64 w-full md:h-auto md:w-1/2">
            <Image src={product.images.primary} alt={product.name} fill className="object-cover" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--brand-brown-700)] shadow-sm">
              <Sparkles size={14} />
              {product.category}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-5 p-6 md:p-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-[var(--brand-brown-700)]">{product.name}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--brand-muted)]">
                  {product.description}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[var(--brand-cream-100)] p-2 text-[var(--brand-muted)] transition hover:bg-[var(--brand-cream-200)]"
                aria-label="Tutup detail"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-[var(--radius-md)] bg-[var(--brand-cream-100)] p-4 text-sm text-[var(--brand-muted)]">
              <p className="font-medium text-[var(--brand-brown-700)]">Catatan Rasa</p>
              <p className="mt-1 leading-relaxed">{product.flavorNotes}</p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-muted)]/70">Harga</p>
                <p className="text-2xl font-semibold text-[var(--brand-brown-700)]">{formatCurrency(product.price)}</p>
              </div>
              <div className="text-xs text-[var(--brand-muted)]">
                {quantity > 0 ? `${quantity} sudah di keranjang` : 'Belum ada di keranjang'}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-brown-500)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand-brown-700)]"
              >
                <ShoppingBag size={18} /> Tambah ke Keranjang
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-[var(--brand-brown-300)] px-6 py-3 text-sm font-semibold text-[var(--brand-brown-700)] transition hover:bg-[var(--brand-cream-100)]"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
