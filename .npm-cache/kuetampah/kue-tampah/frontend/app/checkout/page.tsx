'use client';

import Image from 'next/image';
import Link from 'next/link';

import { CheckoutForm } from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="rounded-[var(--radius-lg)] bg-white/90 p-12 shadow-card">
          <h1 className="text-3xl font-semibold text-[var(--brand-brown-900)]">Belum ada item untuk di-checkout</h1>
          <p className="mt-3 text-sm text-[var(--brand-muted)]">
            Pilih tampah terbaikmu terlebih dahulu. Keranjang akan tersimpan otomatis di perangkatmu.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-[var(--brand-brown-500)] px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-[var(--brand-brown-700)]"
          >
            Telusuri Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-2 border-b border-[var(--brand-brown-300)]/60 pb-6">
        <h1 className="text-3xl font-semibold text-[var(--brand-brown-900)]">Checkout Pesanan</h1>
        <p className="text-[var(--brand-muted)]">
          Kami akan membuka WhatsApp untuk konfirmasi. Jika memilih QRIS, kode QR muncul setelah form dikirim.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.5fr,1fr]">
        <CheckoutForm />

        <aside className="space-y-6 rounded-[var(--radius-lg)] bg-white/90 p-6 shadow-card">
          <div>
            <h2 className="text-xl font-semibold text-[var(--brand-brown-900)]">Ringkasan Pesanan</h2>
            <p className="text-sm text-[var(--brand-muted)]">Silakan cek lagi jumlah dan catatanmu.</p>
          </div>
          <ul className="space-y-4 text-sm">
            {items.map((item) => (
              <li key={item.product.id} className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--brand-cream-100)]">
                  <Image
                    src={item.product.images.primary}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex w-full items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--brand-brown-900)]">{item.product.name}</p>
                    <p className="text-xs text-[var(--brand-muted)]">
                      {item.quantity} x {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-[var(--brand-brown-700)]">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--brand-cream-100)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--brand-muted)]">Total Dibayar</span>
            <span className="text-lg font-semibold text-[var(--brand-brown-900)]">{formatCurrency(subtotal)}</span>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-[var(--brand-cream-100)] px-4 py-3 text-xs text-[var(--brand-brown-700)]">
            Setelah form dikirim, kamu akan diarahkan ke WhatsApp untuk konfirmasi final. Tim kami akan membalas
            maksimal dalam 15 menit pada jam operasional.
          </div>
        </aside>
      </div>
    </main>
  );
}
