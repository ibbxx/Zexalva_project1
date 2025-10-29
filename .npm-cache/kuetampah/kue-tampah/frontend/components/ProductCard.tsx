'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { Product } from '@/lib/products';

import { ProductModal } from '@/components/ProductModal';

type ProductCardProps = {
  product: Product;
};

const cardVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items } = useCart();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const quantityInCart = useMemo(
    () => items.find((item) => item.product.id === product.id)?.quantity ?? 0,
    [items, product.id],
  );

  const handleAddToCart = () => {
    addItem(product.id);
    toast.success(`${product.name} masuk ke keranjang.`);
  };

  return (
    <>
      <motion.article
        className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--brand-cream-200)] bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative h-60 w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--brand-cream-100)]">
          <Image
            src={product.images.primary}
            alt={product.name}
            fill
            className={`object-cover transition duration-500 ${hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 90vw"
          />
          <Image
            src={product.images.secondary}
            alt={`${product.name} alternate`}
            fill
            className={`absolute inset-0 object-cover transition duration-500 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 90vw"
          />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--brand-brown-700)] shadow-sm">
            <Sparkles size={14} />
            {product.category}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-4 right-4 rounded-full bg-[var(--brand-brown-500)] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[var(--brand-brown-700)]"
          >
            Lihat Detail
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 pt-5">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[var(--brand-brown-700)]">{product.name}</h3>
            <p className="text-sm leading-relaxed text-[var(--brand-muted)]">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-muted)]/70">Harga</p>
              <p className="text-lg font-semibold text-[var(--brand-brown-700)]">{formatCurrency(product.price)}</p>
            </div>
            <div className="text-xs text-[var(--brand-muted)]">
              {quantityInCart > 0 ? `${quantityInCart} di keranjang` : 'Belum ada di keranjang'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-brown-500)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand-brown-700)]"
          >
            <ShoppingBag size={16} /> Tambah ke Keranjang
          </button>
        </div>
      </motion.article>

      <ProductModal
        open={open}
        product={product}
        quantity={quantityInCart}
        onClose={() => setOpen(false)}
        onAdd={handleAddToCart}
      />
    </>
  );
};
