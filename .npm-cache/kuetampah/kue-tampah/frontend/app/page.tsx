"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';

const highlights = [
  {
    title: 'Kue Tampah Premium',
    description: 'Disusun rapi dengan garnish modern untuk acara penting dan hantaran elegan.',
  },
  {
    title: 'Checkout via WhatsApp',
    description: 'Pesan dengan sekali klik, atur jadwal pengiriman, dan terima konfirmasi instan.',
  },
  {
    title: 'Rasa Tradisional Kekinian',
    description: 'Resep keluarga turun-temurun dipadukan teknik modern sehingga selalu fresh.',
  },
];

const storyMilestones = [
  {
    year: '1998',
    title: 'Berawal dari Dapur Keluarga',
    description: 'Batch pertama tampah dibuat untuk acara tetangga, hanya 10 pesanan per bulan.',
  },
  {
    year: '2010',
    title: 'Signature Tampah Lahir',
    description: 'Mulai menambah snack box dan tumpeng mini agar lebih lengkap untuk setiap momen.',
  },
  {
    year: '2024',
    title: 'Digital & Ramah Gen Z',
    description: 'Website interaktif dengan Whatsapp checkout dan QRIS agar pemesanan makin mudah.',
  },
];

const galleryItems = [
  { src: '/images/tampah-premium.jpg', title: 'Tampah Premium', caption: 'Favorit keluarga besar' },
  { src: '/images/snack-box.jpg', title: 'Snack Box', caption: 'Teman meeting & event' },
  { src: '/images/jajan-pasar.jpg', title: 'Jajan Pasar', caption: 'Klasik yang bikin nostalgia' },
  { src: '/images/klepon.jpg', title: 'Klepon Gula Aren', caption: 'Kenyal legit isian gula merah' },
  { src: '/images/tumpeng-mini.jpg', title: 'Tumpeng Mini', caption: 'Syukuran makin meriah' },
  { src: '/images/kue-kering.jpg', title: 'Kue Kering', caption: 'Renyah buttery premium' },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function LandingPage() {
  return (
    <main className="pb-28">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-cream-50)] via-[var(--brand-cream-100)] to-[var(--brand-white)]">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-16 h-72 w-72 rounded-full bg-[var(--brand-gold-400)]/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[-120px] h-80 w-80 rounded-full bg-[var(--brand-brown-300)]/25 blur-3xl" />
          <div className="absolute right-[-160px] bottom-[-80px] h-64 w-64 rounded-full bg-[var(--brand-brown-500)]/15 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-20 px-6 py-24 md:flex-row md:items-center">
          <motion.div className="flex-1 space-y-8" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-3 rounded-full bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-brown-500)] shadow-sm">
              Kue Tradisional Rasa Kekinian
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-[var(--brand-brown-900)] md:text-5xl">
              Kue Tampah Modern untuk Semua Momen Istimewa
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--brand-muted)]">
              Temukan tampah premium, snack box korporat, hingga tumpeng mini yang disajikan dengan estetika Gen Z.
              Rasakan pengalaman pemesanan yang smooth lengkap dengan animasi lembut dan checkout via WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/checkout"
                className="rounded-full bg-[var(--brand-brown-500)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[var(--brand-brown-700)]"
              >
                Pesan Sekarang
              </Link>
              <Link
                href="#produk"
                className="rounded-full border border-[var(--brand-brown-300)] px-6 py-3 text-sm font-semibold text-[var(--brand-brown-700)] transition hover:-translate-y-1 hover:bg-[var(--brand-cream-100)]"
              >
                Jelajahi Menu
              </Link>
            </div>
            <div className="grid gap-4 pt-6 sm:grid-cols-3">
              {highlights.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-[var(--radius-md)] border border-[var(--brand-cream-200)] bg-white/80 p-4 shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
                >
                  <h3 className="text-sm font-semibold text-[var(--brand-brown-700)]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--brand-muted)]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative flex-1"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
          >
            <div className="absolute -inset-6 rounded-[var(--radius-lg)] border border-white/60" />
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] shadow-2xl">
              <Image
                src="/hero-dessert.jpg"
                alt="Hero Tampah"
                width={640}
                height={640}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute bottom-6 left-6 rounded-[var(--radius-md)] bg-white/85 px-5 py-3 text-sm text-[var(--brand-brown-700)] shadow-lg">
                Freshly baked setiap hari — tampilan cantik siap difoto.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="produk" className="mx-auto mt-24 max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--brand-muted)]">Signature Collection</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-brown-900)]">Pilihan Paling Disukai Gen Z</h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--brand-muted)]">
              Semua produk disiapkan dengan bahan premium, disimpan lokal, dan siap kamu checkout kapan pun. Hover
              untuk melihat alternate shot, klik untuk detail rasa.
            </p>
          </motion.div>
          <Link
            href="/checkout"
            className="inline-flex h-fit rounded-full bg-[var(--brand-brown-500)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-1 hover:bg-[var(--brand-brown-700)]"
          >
            Lanjut ke Checkout
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="cerita" className="mx-auto mt-24 max-w-6xl px-6">
        <motion.div
          className="grid gap-8 rounded-[var(--radius-lg)] bg-white/90 p-8 shadow-xl backdrop-blur md:grid-cols-[1.1fr,1fr]"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--brand-muted)]">Cerita Kami</p>
            <h2 className="text-3xl font-semibold text-[var(--brand-brown-900)]">Kue Tampah yang Tumbuh Bersama Pelanggan</h2>
            <p className="text-sm leading-relaxed text-[var(--brand-muted)]">
              Dari dapur rumah di Bandung hingga rak display event modern, kami selalu menjaga kehangatan rasa pada
              setiap tampah. Kini, pengalaman pemesanan dibuat lebih simple dan visually addictive untuk generasi baru.
            </p>
            <Link
              href="#galeri"
              className="inline-flex rounded-full border border-[var(--brand-brown-300)] px-5 py-3 text-sm font-semibold text-[var(--brand-brown-700)] transition hover:-translate-y-1 hover:bg-[var(--brand-cream-100)]"
            >
              Lihat Galeri
            </Link>
          </div>
          <div className="grid gap-4">
            {storyMilestones.map((milestone) => (
              <div
                key={milestone.year}
                className="rounded-[var(--radius-md)] border border-[var(--brand-cream-200)] bg-[var(--brand-cream-50)] p-4 shadow-sm transition hover:-translate-y-1 hover:border-[var(--brand-brown-500)] hover:bg-white"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--brand-brown-500)]">
                  {milestone.year}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--brand-brown-900)]">{milestone.title}</h3>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">{milestone.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="galeri" className="mx-auto mt-24 max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--brand-muted)]">Preview</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-brown-900)]">Galeri Rasa yang Menggoda</h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--brand-muted)]">
              Scroll pelan-pelan, biarkan visual lembut dan lighting hangat membawa kamu ke aroma tampah yang baru saja
              keluar dari dapur.
            </p>
          </motion.div>
          <Link
            href="/checkout"
            className="inline-flex h-fit rounded-full bg-[var(--brand-brown-500)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-1 hover:bg-[var(--brand-brown-700)]"
          >
            Konsultasi Menu
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <motion.div
              key={item.src}
              whileHover={{ y: -12 }}
              className="group relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--brand-cream-100)] shadow-lg"
            >
              <Image src={item.src} alt={item.title} width={420} height={420} className="h-72 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/80">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="kontak"
        className="mx-auto mt-24 max-w-5xl rounded-[var(--radius-lg)] bg-[var(--brand-brown-900)] px-6 py-16 text-white"
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold leading-tight">Siap menyusun tampah impianmu</h2>
            <p className="text-white/80">
              Jelaskan konsep acara, jumlah tamu, atau preferensi rasa. Tim kami akan bantu rekomendasi paket lengkap
              beserta opsi pembayaran yang paling nyaman.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/20 px-4 py-2">WhatsApp Interaktif</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Pembayaran QRIS</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Reminders Otomatis</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-brown-900)] transition hover:-translate-y-1 hover:bg-white/90"
            >
              Isi Data Checkout
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
