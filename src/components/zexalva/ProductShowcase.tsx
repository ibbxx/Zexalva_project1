import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '@/lib/getProducts';

const kelas = {
  bagianUtama: 'bg-white py-24',
  pembungkus: 'mx-auto flex max-w-[1200px] flex-col gap-16 px-6',
  tajuk: 'flex flex-col items-center gap-2 text-center',
  labelMusim: 'text-xs uppercase tracking-[0.6em] text-black/50',
  judul: 'font-oswald text-3xl uppercase tracking-[0.4em] text-black',
  kisiProduk: 'grid gap-12 md:grid-cols-3',
  kartuProduk: 'group flex flex-col items-center gap-6 text-black transition-transform duration-300 hover:-translate-y-2',
  wadahGambar: 'relative w-full overflow-hidden bg-white',
  gambarProduk: 'mx-auto w-full max-w-[320px] object-contain',
  deskripsiProduk: 'flex flex-col items-center gap-2 text-center',
  namaProduk: 'text-xs uppercase tracking-[0.4em] text-black/60',
  hargaProduk: 'text-[13px] uppercase tracking-[0.35em] text-black/40',
};

export default function ProductShowcase() {
  const navigate = useNavigate();
  // 🔧 editable: sesuaikan jumlah produk yang ditampilkan
  const products = useMemo(() => getFeaturedProducts().slice(0, 6), []);

  return (
    <section className={kelas.bagianUtama}>
      <div className={kelas.pembungkus}>
        <div className={kelas.tajuk}>
          {/* // 🔧 editable: ganti label musim koleksi */}
          <p className={kelas.labelMusim}>F/W 2025</p>
          {/* // 🔧 editable: ubah judul section produk unggulan */}
          <h2 className={kelas.judul}>Season Edit</h2>
        </div>

        <div className={kelas.kisiProduk}>
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/product/${product.handle}`)}
              className={kelas.kartuProduk}
            >
              <div className={kelas.wadahGambar}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={kelas.gambarProduk}
                />
              </div>
              <div className={kelas.deskripsiProduk}>
                {/* // 🔧 editable: tampilkan atau ubah format nama produk */}
                <p className={kelas.namaProduk}>{product.name}</p>
                {/* // 🔧 editable: atur format harga produk */}
                <span className={kelas.hargaProduk}>
                  Rp {product.price.toLocaleString('id-ID')} IDR
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
