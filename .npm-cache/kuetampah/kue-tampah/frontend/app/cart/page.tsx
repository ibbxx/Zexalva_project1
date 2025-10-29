'use client';

import type { FormEvent } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Search, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { products, type Product } from '@/lib/products';

type CartEntry = {
  id: string;
  quantity: number;
  product: Product;
};

type CartPanelItemProps = {
  item: CartEntry;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

const CartPanelItem = ({ item, onIncrement, onDecrement, onRemove }: CartPanelItemProps) => {
  const {
    product: { name, flavorNotes, price, images },
    quantity,
  } = item;

  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-[var(--brand-muted)]/12 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
      <div className="relative h-44 w-full overflow-hidden rounded-[20px] bg-[var(--brand-panel)] sm:h-32 sm:w-32">
        <Image src={images.primary} alt={name} fill className="object-cover" sizes="(min-width: 640px) 128px, 100vw" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-base font-semibold text-[var(--brand-black)]">{name}</p>
        <p className="text-sm leading-relaxed text-[var(--brand-muted)]">{flavorNotes}</p>
        <p className="text-sm font-semibold text-[var(--brand-green-800)]">{formatCurrency(price)}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-4 sm:items-stretch">
        <div className="inline-flex items-center justify-between gap-3 rounded-full border border-[var(--brand-muted)]/18 bg-[var(--brand-panel)] px-3 py-2 text-sm font-semibold text-[var(--brand-black)]">
          <button
            type="button"
            onClick={onDecrement}
            className="rounded-full bg-white p-1 text-[var(--brand-muted)] transition hover:bg-[var(--brand-green-200)]/40 hover:text-[var(--brand-green-800)]"
            aria-label={`Kurangi ${name}`}
          >
            <Minus size={14} />
          </button>
          <span className="min-w-[2rem] text-center">{quantity}</span>
          <button
            type="button"
            onClick={onIncrement}
            className="rounded-full bg-white p-1 text-[var(--brand-muted)] transition hover:bg-[var(--brand-green-200)]/40 hover:text-[var(--brand-green-800)]"
            aria-label={`Tambah ${name}`}
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-1 text-right sm:text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--brand-muted)]">Subtotal</p>
          <p className="text-lg font-semibold text-[var(--brand-black)]">{formatCurrency(price * quantity)}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-muted)]/15 px-4 py-2 text-xs font-semibold text-[var(--brand-muted)] transition hover:border-[var(--brand-muted)]/35 hover:text-[var(--brand-black)]"
          aria-label={`Hapus ${name}`}
        >
          <Trash size={14} />
          Hapus
        </button>
      </div>
    </div>
  );
};

export default function CartPage() {
  const { items, subtotal, itemCount, clearCart, updateQuantity, removeItem, addItem } = useCart();

  const isEmpty = items.length === 0;
  const discount = 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const cartQuantities = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((entry) => map.set(entry.product.id, entry.quantity));
    return map;
  }, [items]);

  const displayedProducts = useMemo(() => products, []);

  const handleIncrement = (item: CartEntry) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = (item: CartEntry) => {
    if (item.quantity <= 1) {
      removeItem(item.id);
      toast.success(`${item.product.name} dihapus dari keranjang.`);
      return;
    }
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = (item: CartEntry) => {
    removeItem(item.id);
    toast.success(`${item.product.name} dihapus dari keranjang.`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Keranjang dikosongkan.');
  };

  const handleApplyCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const coupon = (formData.get('coupon') as string | null)?.trim();
    if (!coupon) {
      toast.error('Masukkan kode kupon terlebih dahulu.');
      return;
    }
    toast.success(`Kupon ${coupon} akan kami proses.`);
    event.currentTarget.reset();
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product.id);
    toast.success(`${product.name} masuk ke keranjang.`);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="flex flex-col gap-2 border-b border-[var(--brand-muted)]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[var(--brand-black)]">Keranjang Pesanan</h1>
        <p className="text-sm text-[var(--brand-muted)]">
          Simpan pilihanmu di sini. Kamu bisa lanjut checkout kapan saja atau eksplor menu lain terlebih dahulu.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(360px,420px),1fr] xl:gap-12">
        <div className="space-y-5">
          {isEmpty ? (
            <section className="flex h-full flex-col items-center justify-center gap-4 rounded-[24px] bg-white p-10 text-center shadow-card">
              <p className="text-lg font-semibold text-[var(--brand-black)]">Keranjang masih kosong</p>
              <p className="max-w-xs text-sm text-[var(--brand-muted)]">
                Tambahkan tampah favorit dan kami akan mengingatkanmu bila checkout belum selesai dalam 15 menit.
              </p>
              <Link
                href="/"
                className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-1 hover:bg-[var(--brand-brown-700)]"
              >
                Lihat Katalog
              </Link>
            </section>
          ) : (
            <>
              <section className="rounded-[24px] bg-white p-6 shadow-card">
                <label className="inline-flex h-10 items-center rounded-full border border-[var(--brand-muted)]/15 bg-white px-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-muted)]">
                  Keranjang
                </label>
                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <CartPanelItem
                      key={item.product.id}
                      item={item}
                      onIncrement={() => handleIncrement(item)}
                      onDecrement={() => handleDecrement(item)}
                      onRemove={() => handleRemove(item)}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] bg-white p-6 shadow-card">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-muted)]">Kupon</h2>
                <p className="mt-2 text-sm text-[var(--brand-muted)]">
                  Punya kode promo spesial? Masukkan di sini dan nikmati potongan harga untuk pesananmu.
                </p>
                <form onSubmit={handleApplyCoupon} className="mt-4 grid gap-3 sm:grid-cols-[1fr,140px]">
                  <div className="relative">
                    <input
                      type="text"
                      name="coupon"
                      placeholder="Masukkan kode kupon"
                      className="w-full rounded-[12px] border border-[var(--brand-muted)]/18 bg-white px-4 py-3 text-sm text-[var(--brand-black)] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition focus:border-[var(--brand-green-600)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green-200)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-[46px] items-center justify-center rounded-[12px] bg-[var(--brand-green-600)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-green-800)]"
                  >
                    Terapkan
                  </button>
                </form>
              </section>

              <section className="rounded-[24px] bg-white p-6 shadow-card">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-muted)]">Checkout</h2>
                <dl className="mt-4 grid grid-cols-[1fr,auto] gap-y-3 text-sm text-[var(--brand-muted)]">
                  <dt>Subtotal keranjang</dt>
                  <dd className="font-semibold text-[var(--brand-black)]">{formatCurrency(subtotal)}</dd>
                  <dt>Diskon</dt>
                  <dd className="font-semibold text-[var(--brand-black)]">{formatCurrency(discount)}</dd>
                  <dt>Ongkir</dt>
                  <dd className="font-semibold text-[var(--brand-green-800)]">Gratis</dd>
                  <dt>Jumlah item</dt>
                  <dd className="font-semibold text-[var(--brand-black)]">{itemCount} pcs</dd>
                </dl>
                <div className="mt-6 flex flex-col gap-4 rounded-[18px] bg-[var(--brand-panel)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-muted)]">Total Bayar</span>
                    <p className="text-2xl font-semibold text-[var(--brand-black)]">{formatCurrency(total)}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:w-auto sm:flex-row">
                    <Link
                      href="/checkout"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--brand-green-600)] px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-[var(--brand-green-800)]"
                    >
                      Lanjut Checkout
                    </Link>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="inline-flex items-center justify-center rounded-full border border-[var(--brand-muted)]/18 px-6 py-3 text-sm font-semibold text-[var(--brand-muted)] transition hover:bg-[var(--brand-panel)]"
                    >
                      Bersihkan
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[24px] bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-[var(--brand-black)]">Tambah menu lagi</h2>
            <p className="mt-2 text-sm text-[var(--brand-muted)]">
              Jelajahi pilihan kue dan tampah lain, lengkap dengan gambarnya. Klik tambah untuk memasukkan ke keranjang.
            </p>
            <div className="relative mt-4">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
              />
              <input
                type="search"
                placeholder="Cari tampah, jajan pasar, snack box..."
                className="h-12 w-full rounded-full border border-[var(--brand-muted)]/18 bg-white pl-11 pr-4 text-sm text-[var(--brand-black)] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition focus:border-[var(--brand-green-600)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green-200)]"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <Link
                href="/#produk"
                className="inline-flex items-center rounded-full bg-[var(--brand-panel)] px-4 py-2 font-semibold text-[var(--brand-green-800)] transition hover:bg-[var(--brand-green-200)]/30"
              >
                Lihat katalog
              </Link>
              <Link
                href="/#galeri"
                className="inline-flex items-center rounded-full border border-[var(--brand-muted)]/18 px-4 py-2 font-semibold text-[var(--brand-pink-500)] transition hover:bg-[var(--brand-panel)]"
              >
                Lihat galeri
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {displayedProducts.map((product) => {
                const quantityInCart = cartQuantities.get(product.id) ?? 0;
                return (
                  <article
                    key={product.id}
                    className="flex items-center gap-4 rounded-[20px] border border-[var(--brand-muted)]/12 bg-white p-4 shadow-sm"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-[16px] bg-white">
                      <Image
                        src={product.images.primary}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-semibold text-[var(--brand-black)]">{product.name}</span>
                      <span className="text-xs leading-5 text-[var(--brand-muted)]">{product.description}</span>
                      <span className="text-xs font-semibold text-[var(--brand-green-800)]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {quantityInCart > 0 && (
                        <span className="rounded-full bg-[var(--brand-panel)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
                          {quantityInCart} di keranjang
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="rounded-full bg-[var(--brand-green-600)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-green-800)]"
                      >
                        Tambah
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
