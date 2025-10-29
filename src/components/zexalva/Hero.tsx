import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '@/lib/getProducts';

interface Slide {
  season: string;
  headline: string;
  description: string;
  ctaPrimary: { label: string; path: string };
  ctaSecondary: { label: string; path: string };
  images: [string, string];
}

// 🔧 editable: ubah durasi autoplay hero (milidetik)
const AUTO_PLAY_MS = 6000;

const kelas = {
  bagianUtama: 'relative min-h-screen',
  bingkaiSlide: 'relative flex min-h-screen w-full items-center justify-center overflow-hidden',
  kisiGambar: 'absolute inset-0 grid grid-cols-1 md:grid-cols-2',
  wadahGambar: 'relative',
  gambar: 'h-full w-full object-cover',
  lapisanGelap: 'absolute inset-0 bg-black/35',
  lapisanGradasi: 'absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60',
  konten: 'relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white',
  teksMusim: 'text-xs uppercase tracking-[0.6em] text-white/80 mb-6',
  judul: 'text-4xl md:text-6xl font-oswald uppercase tracking-[0.3em] mb-4',
  deskripsi: 'max-w-2xl text-sm md:text-base text-white/80 mb-10 leading-relaxed',
  kumpulanTombol: 'flex flex-col gap-4 sm:flex-row',
  tombolUtama: 'bg-white text-black px-10 py-3 uppercase text-xs tracking-[0.4em] font-semibold transition hover:bg-black hover:text-white',
  tombolSekunder: 'border border-white/60 text-white px-10 py-3 uppercase text-xs tracking-[0.4em] font-semibold transition hover:bg-white hover:text-black',
  indikator: 'absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3',
  tombolIndikator: 'h-2 rounded-full transition-all duration-300',
  indikatorAktif: 'w-10 bg-white',
  indikatorPasif: 'w-2 bg-white/50 hover:bg-white',
};

const HeroComponent = () => {
  const navigate = useNavigate();
  const featured = useMemo(() => getFeaturedProducts().slice(0, 4), []);

  // perf: optimized
  const slides: Slide[] = useMemo(() => [
    {
      season: 'F/W 2025',
      headline: 'ZEXALVA x Vespucci',
      description:
        'Eksklusif kolaborasi musim gugur yang menggabungkan konstruksi utilitarian dengan grafis rebellious.',
      ctaPrimary: { label: 'View Collection', path: '/shop' },
      ctaSecondary: { label: 'View Lookbook', path: '/about#lookbook' },
      images: [
        featured[0]?.images[0] ?? 'https://images.pexels.com/photos/1033713/pexels-photo-1033713.jpeg',
        featured[1]?.images[0] ?? 'https://images.pexels.com/photos/1038049/pexels-photo-1038049.jpeg',
        // 🔧 editable: sesuaikan fallback gambar hero
      ],
    },
    {
      season: 'Campaign',
      headline: 'Night Shift Capsule',
      description:
        'Tekstur washed dan silhouette oversized untuk malam-malam panjang di kota.',
      ctaPrimary: { label: 'Shop Night Shift', path: '/shop?view=sale' },
      ctaSecondary: { label: 'Campaign Story', path: '/about#campaign' },
      images: [
        featured[2]?.images[0] ?? 'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg',
        featured[3]?.images[0] ?? 'https://images.pexels.com/photos/995332/pexels-photo-995332.jpeg',
        // 🔧 editable: ganti fallback gambar campaign
      ],
    },
    {
      season: 'Archive',
      headline: 'Rebellion Staples',
      description:
        'Pieces yang membentuk identitas ZEXALVA: timeless tee, statement hoodie, dan tactical layering.',
      ctaPrimary: { label: 'Explore Archive', path: '/shop' },
      ctaSecondary: { label: 'Brand Story', path: '/about' },
      images: [
        featured[1]?.images[1] ?? 'https://images.pexels.com/photos/955889/pexels-photo-955889.jpeg',
        featured[0]?.images[1] ?? 'https://images.pexels.com/photos/1009773/pexels-photo-1009773.jpeg',
        // 🔧 editable: ubah fallback gambar archive
      ],
    },
  ], [featured]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[index];

  return (
    <section className={kelas.bagianUtama}>
      <div className={kelas.bingkaiSlide}>
        <div className={kelas.kisiGambar}>
          {currentSlide.images.map((image, imgIdx) => (
            <div key={image + imgIdx} className={kelas.wadahGambar}>
              <img
                src={image}
                alt={currentSlide.headline}
                loading="lazy"
                className={kelas.gambar}
              />
              <div className={kelas.lapisanGelap} />
            </div>
          ))}
        </div>

        {/* // 🔧 editable: atur gradasi overlay hero */}
        <div className={kelas.lapisanGradasi} />

        <div className={kelas.konten}>
          {/* // 🔧 editable: ganti label musim atau campaign */}
          <p className={kelas.teksMusim}>{currentSlide.season}</p>
          {/* // 🔧 editable: ubah headline hero */}
          <h1 className={kelas.judul}>{currentSlide.headline}</h1>
          {/* // 🔧 editable: ganti deskripsi hero */}
          <p className={kelas.deskripsi}>{currentSlide.description}</p>
          <div className={kelas.kumpulanTombol}>
            {/* // 🔧 editable: sesuaikan label tombol CTA utama */}
            <button
              onClick={() => navigate(currentSlide.ctaPrimary.path)}
              className={kelas.tombolUtama}
            >
              {currentSlide.ctaPrimary.label}
            </button>
            {/* // 🔧 editable: ubah label CTA sekunder */}
            <button
              onClick={() => navigate(currentSlide.ctaSecondary.path)}
              className={kelas.tombolSekunder}
            >
              {currentSlide.ctaSecondary.label}
            </button>
          </div>
        </div>

        <div className={kelas.indikator}>
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setIndex(dotIdx)}
              className={`${kelas.tombolIndikator} ${
                dotIdx === index ? kelas.indikatorAktif : kelas.indikatorPasif
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HeroComponent);
