'use client';

import Image from 'next/image';
import { Minus, Plus, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';

type CartItemProps = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export const CartItem = ({ id, name, image, price, quantity }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(id);
      toast.success(`${name} dihapus dari keranjang.`);
      return;
    }
    updateQuantity(id, quantity - 1);
  };

  const handleRemove = () => {
    removeItem(id);
    toast.success(`${name} dihapus dari keranjang.`);
  };

  return (
    <div className="grid gap-4 rounded-[var(--radius-md)] bg-white/90 p-4 shadow-sm sm:grid-cols-[120px,1fr,auto] sm:items-center">
      <div className="relative h-28 w-full overflow-hidden rounded-[var(--radius-sm)]">
        <Image src={image} alt={name} fill className="object-cover" sizes="120px" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-[var(--brand-brown-700)]">{name}</h3>
        <p className="text-sm font-medium text-[var(--brand-brown-500)]">{formatCurrency(price)}</p>
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-cream-100)] px-3 py-1 text-xs text-[var(--brand-muted)]">
          <span>Subtotal</span>
          <span className="font-semibold text-[var(--brand-brown-700)]">{formatCurrency(price * quantity)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--brand-brown-300)] px-3 py-1">
          <button
            type="button"
            onClick={handleDecrement}
            className="p-1 text-[var(--brand-brown-500)] transition hover:text-[var(--brand-brown-700)]"
            aria-label="Kurangi"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-sm font-semibold text-[var(--brand-brown-700)]">{quantity}</span>
          <button
            type="button"
            onClick={handleIncrement}
            className="p-1 text-[var(--brand-brown-500)] transition hover:text-[var(--brand-brown-700)]"
            aria-label="Tambah"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="rounded-full bg-[var(--brand-cream-100)] p-2 text-[var(--brand-brown-500)] transition hover:bg-[var(--brand-cream-200)]"
          aria-label={`Hapus ${name}`}
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
};
