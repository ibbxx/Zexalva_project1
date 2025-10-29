import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '@/lib/getProducts';

const kelas = {
  bagianUtama: 'bg-[#f5f4f2] py-24',
  pembungkus: 'mx-auto flex max-w-[1100px] flex-col gap-16 px-6 md:flex-row md:items-center',
  kolomTeks: 'flex-1 space-y-6 text-black',
  labelEditorial: 'text-xs uppercase tracking-[0.6em] text-black/40',
  judul: 'font-oswald text-4xl uppercase tracking-[0.35em]',
  deskripsi: 'text-sm leading-relaxed text-black/70 max-w-xl',
  cerita: 'text-sm leading-relaxed text-black/60 max-w-xl',
  gridStatistik: 'grid grid-cols-3 gap-6 pt-6 text-xs uppercase tracking-[0.3em] text-black/60',
  angkaStatistik: 'font-oswald text-3xl text-black',
  kolomMedia: 'flex-1',
  kartuSorotan: 'relative overflow-hidden bg-white shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)]',
  gambarSorotan: 'w-full object-cover',
};

export default function BrandBillboard() {
  // 🔧 editable: ubah logika pemilihan produk highlight
  const highlight = useMemo(() => getFeaturedProducts()[0], []);

  return (
    <section className={kelas.bagianUtama}>
      <div className={kelas.pembungkus}>
        <motion.div
          className={kelas.kolomTeks}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
          viewport={{ once: true, amount: 0.35 }}
        >
          {/* // 🔧 editable: ganti label section editorial */}
          <p className={kelas.labelEditorial}>Editorial</p>
          {/* // 🔧 editable: ubah judul billboard brand */}
          <h2 className={kelas.judul}>Identity & Aesthetics</h2>
          {/* // 🔧 editable: perbarui deskripsi identitas brand */}
          <p className={kelas.deskripsi}>
            ZEXALVA adalah eksplorasi streetwear urban khas Indonesia—grafis berani,
            siluet oversized, dan material premium yang siap mengiringi perjalananmu
            di kota. Setiap rilisan dikurasi dengan jumlah terbatas untuk menjaga rasa eksklusif.
          </p>
          {/* // 🔧 editable: ubah highlight cerita koleksi */}
          <p className={kelas.cerita}>
            Koleksi terbaru kami terinspirasi dari kultur klub malam Jakarta hingga
            arsitektur brutalist, menghasilkan palet warna netral dengan aksen elektrik.
          </p>
          <div className={kelas.gridStatistik}>
            <div>
              <p className={kelas.angkaStatistik}>100+</p>
              {/* // 🔧 editable: sesuaikan angka dan label statistik */}
              <span>Pieces crafted</span>
            </div>
            <div>
              <p className={kelas.angkaStatistik}>5K+</p>
              {/* // 🔧 editable: ubah jumlah komunitas */}
              <span>Community members</span>
            </div>
            <div>
              <p className={kelas.angkaStatistik}>2021</p>
              {/* // 🔧 editable: ganti informasi tahun berdiri */}
              <span>Year founded</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={kelas.kolomMedia}
          initial={{ opacity: 0, x: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className={kelas.kartuSorotan}
            initial={{ boxShadow: '0px 0px 0px rgba(0,0,0,0)' }}
            whileInView={{ boxShadow: '0px 25px 50px -20px rgba(0,0,0,0.25)' }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
          >
            <motion.img
              src={highlight?.images[0] ?? 'https://images.pexels.com/photos/955889/pexels-photo-955889.jpeg'}
              alt={highlight?.name ?? 'ZEXALVA Look'}
              className={kelas.gambarSorotan}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            {/* // 🔧 editable: atur fallback gambar dan alt text billboard */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
