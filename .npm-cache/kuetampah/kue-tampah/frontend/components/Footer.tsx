import { Clock, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

type QuickLink =
  | { label: string; href: string; kind: 'anchor' }
  | { label: string; href: '/checkout'; kind: 'route' };

const quickLinks: QuickLink[] = [
  { label: 'Katalog Produk', href: '#produk', kind: 'anchor' },
  { label: 'Cerita Kami', href: '#cerita', kind: 'anchor' },
  { label: 'Galeri', href: '#galeri', kind: 'anchor' },
  { label: 'Checkout', href: '/checkout', kind: 'route' },
];

const services = [
  'Tampah Premium Acara',
  'Snack Box Korporat',
  'Hantaran Tumpeng Mini',
  'Jajanan Pasar Authentic',
];

const currentYear = new Date().getFullYear();

export const Footer = () => (
  <footer className="mt-20 border-t border-[var(--brand-cream-200)] bg-[var(--brand-cream-50)]">
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.2fr,1fr,1fr]">
      <div className="space-y-4">
        <Link href="/" className="text-2xl font-semibold text-[var(--brand-brown-700)]">
          Kue Tampah
        </Link>
        <p className="text-sm leading-6 text-[var(--brand-muted)]">
          Kami menyajikan tampah terbaik dengan racikan resep keluarga dan sentuhan modern. Atur jadwal, pilih metode
          pembayaran, dan nikmati pelayanan interaktif dari tim kami.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-[var(--brand-muted)]">
          <span className="rounded-full bg-[var(--brand-cream-100)] px-3 py-1 text-[var(--brand-brown-500)]">
            #TampahPremium
          </span>
          <span className="rounded-full bg-[var(--brand-surface)] px-3 py-1">#JajananPasar</span>
          <span className="rounded-full bg-[var(--brand-surface)] px-3 py-1">#CitaRasaTradisional</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-muted)]">
          Navigasi Cepat
        </h3>
        <ul className="mt-4 space-y-3 text-sm text-[var(--brand-muted)]">
          {quickLinks.map((link) => (
            <li key={link.label}>
              {link.kind === 'anchor' ? (
                <a href={link.href} className="transition hover:text-[var(--brand-black)]">
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className="transition hover:text-[var(--brand-black)]">
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <h4 className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-muted)]">
          Layanan Unggulan
        </h4>
        <ul className="mt-3 space-y-2 text-sm text-[var(--brand-muted)]">
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-muted)]">
          Hubungi Kami
        </h3>
        <ul className="space-y-3 text-sm text-[var(--brand-muted)]">
          <li className="flex items-start gap-2">
            <MapPin size={16} className="mt-1 text-[var(--brand-brown-500)]" />
            <span>Jl. Rasa Nusantara No. 15, Bandung</span>
          </li>
          <li className="flex items-center gap-2">
            <Phone size={16} className="text-[var(--brand-brown-500)]" />
            <a href="tel:+6281234567890" className="transition hover:text-[var(--brand-black)]">
              +62 812 3456 7890
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail size={16} className="text-[var(--brand-brown-500)]" />
            <a href="mailto:halo@kuetampah.id" className="transition hover:text-[var(--brand-black)]">
              halo@kuetampah.id
            </a>
          </li>
          <li className="flex items-start gap-2">
            <Clock size={16} className="mt-1 text-[var(--brand-brown-500)]" />
            <span>Senin - Minggu, 08.00 - 21.00 WIB</span>
          </li>
        </ul>
        <div className="flex items-center gap-3 text-sm text-[var(--brand-muted)]">
          <Instagram size={18} className="text-[var(--brand-brown-500)]" />
          <a
            href="https://instagram.com/kuetampah"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--brand-black)]"
          >
            @kuetampah
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-[var(--brand-cream-200)] bg-[var(--brand-cream-100)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-[var(--brand-muted)] md:flex-row md:items-center md:justify-between">
        <span>© {currentYear} Kue Tampah. Seluruh hak cipta dilindungi.</span>
        <div className="flex flex-wrap gap-4">
          <a href="/#cerita" className="transition hover:text-[var(--brand-black)]">
            Tentang Kami
          </a>
          <a href="/#produk" className="transition hover:text-[var(--brand-black)]">
            Menu
          </a>
          <Link href="/checkout" className="transition hover:text-[var(--brand-black)]">
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
