'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navigationItems = [
  { label: 'Produk', href: '#produk' },
  { label: 'Cerita', href: '#cerita' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Kontak', href: '#kontak' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--brand-cream-200)] bg-[var(--brand-cream-50)]/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold text-[var(--brand-brown-700)]">
          Kue Tampah
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--brand-muted)] md:flex">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-[var(--brand-brown-700)]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="hidden rounded-full border border-[var(--brand-brown-300)] px-4 py-2 text-sm font-semibold text-[var(--brand-brown-500)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-cream-100)] md:inline-flex"
          >
            Keranjang
          </Link>
          <Link
            href="/checkout"
            className="hidden rounded-full bg-[var(--brand-brown-500)] px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-[var(--brand-brown-700)] md:inline-flex"
          >
            Pesan Sekarang
          </Link>
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-brown-300)] text-[var(--brand-brown-500)] transition hover:bg-[var(--brand-cream-100)] md:hidden"
            aria-label="Toggle navigasi"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden transition-transform duration-300 ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="space-y-4 border-t border-[var(--brand-cream-200)] bg-white px-6 py-6 text-sm font-medium text-[var(--brand-muted)] shadow-lg">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-[var(--radius-sm)] px-3 py-2 transition hover:bg-[var(--brand-cream-100)] hover:text-[var(--brand-brown-700)]"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-3">
            <Link
              href="/cart"
              className="rounded-full border border-[var(--brand-brown-300)] px-4 py-2 text-center text-sm font-semibold text-[var(--brand-brown-500)] transition hover:bg-[var(--brand-cream-100)]"
              onClick={closeMenu}
            >
              Keranjang
            </Link>
            <Link
              href="/checkout"
              className="rounded-full bg-[var(--brand-brown-500)] px-4 py-2 text-center text-sm font-semibold text-white shadow-card transition hover:bg-[var(--brand-brown-700)]"
              onClick={closeMenu}
            >
              Pesan Sekarang
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
