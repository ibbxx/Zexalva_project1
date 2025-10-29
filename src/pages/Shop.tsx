import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllProducts, getCategories } from '@/lib/getProducts';

// 🔧 editable: konfigurasi rentang harga filter toko
const priceFilters = [
  { value: 'all', label: 'All Prices' },
  { value: 'under300', label: 'Under Rp 300k' },
  { value: '300to500', label: 'Rp 300k - 500k' },
  { value: 'over500', label: 'Over Rp 500k' },
];

const allProducts = getAllProducts();
const categories = getCategories();

function useInitialFilters() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const view = params.get('view');

  if (view === 'collection') return { category: 'All', price: 'all' };
  if (view === 'sale') return { category: 'All', price: 'under300' };
  return { category: 'All', price: 'all' };
}

const kelas = {
  halaman: 'min-h-screen bg-[#f5f4f2] pt-32 pb-24',
  kontainer: 'mx-auto flex max-w-[1200px] flex-col gap-12 px-6',
  tajuk: 'flex flex-col gap-3 text-black',
  labelToko: 'text-xs uppercase tracking-[0.6em] text-black/40',
  judul: 'font-oswald text-4xl uppercase tracking-[0.35em]',
  infoJumlah: 'text-xs uppercase tracking-[0.35em] text-black/40',
  tataLetak: 'flex flex-col gap-10 md:flex-row',
  bilahSamping: 'md:w-64 space-y-8 text-xs uppercase tracking-[0.3em] text-black/60',
  blokFilter: 'space-y-3',
  labelFilter: 'text-black/40',
  tombolFilter: 'block w-full text-left transition hover:text-black',
  areaProduk: 'flex-1',
  pesanKosong: 'py-20 text-center text-black/50',
  kisiProduk: 'grid gap-12 sm:grid-cols-2 lg:grid-cols-3',
  kartuProduk: 'group flex flex-col items-center gap-6 text-black transition-transform duration-300 hover:-translate-y-2',
  wadahGambar: 'relative w-full overflow-hidden bg-white',
  gambarProduk: 'mx-auto w-full max-w-[320px] object-contain',
  deskripsiProduk: 'flex flex-col items-center gap-2 text-center',
  namaProduk: 'text-xs uppercase tracking-[0.35em] text-black/60',
  hargaProduk: 'text-[13px] uppercase tracking-[0.35em] text-black/40',
  tombolAktif: 'text-black',
};

export default function Shop() {
  const navigate = useNavigate();
  const initial = useInitialFilters();
  const [selectedCategory, setSelectedCategory] = useState<string>(initial.category);
  const [priceRange, setPriceRange] = useState<string>(initial.price);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (priceRange === 'under300') {
      filtered = filtered.filter((p) => p.price < 300000);
    } else if (priceRange === '300to500') {
      filtered = filtered.filter((p) => p.price >= 300000 && p.price < 500000);
    } else if (priceRange === 'over500') {
      filtered = filtered.filter((p) => p.price >= 500000);
    }

    return filtered;
  }, [selectedCategory, priceRange]);

  return (
    <div className={kelas.halaman}>
      <div className={kelas.kontainer}>
        <div className={kelas.tajuk}>
          {/* // 🔧 editable: ubah label kecil di header toko */}
          <p className={kelas.labelToko}>Zexalva store</p>
          {/* // 🔧 editable: ganti judul halaman toko */}
          <h1 className={kelas.judul}>Shop</h1>
          {/* // 🔧 editable: atur format teks jumlah produk */}
          <span className={kelas.infoJumlah}>
            {filteredProducts.length} products available
          </span>
        </div>

        <div className={kelas.tataLetak}>
          <aside className={kelas.bilahSamping}>
            <div className={kelas.blokFilter}>
              {/* // 🔧 editable: ubah judul filter kategori */}
              <p className={kelas.labelFilter}>Category</p>
              {/* // 🔧 editable: ganti label filter kategori default */}
              <button
                onClick={() => setSelectedCategory('All')}
                className={`${kelas.tombolFilter} ${
                  selectedCategory === 'All' ? kelas.tombolAktif : ''
                }`}
              >
                All
              </button>
              {/* // 🔧 editable: sesuaikan nama kategori produk */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`${kelas.tombolFilter} ${
                    selectedCategory === cat.name ? kelas.tombolAktif : ''
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className={kelas.blokFilter}>
              {/* // 🔧 editable: ubah judul filter harga */}
              <p className={kelas.labelFilter}>Price</p>
              {/* // 🔧 editable: ganti label rentang harga sesuai strategi pricing */}
              {priceFilters.map((price) => (
                <button
                  key={price.value}
                  onClick={() => setPriceRange(price.value)}
                  className={`${kelas.tombolFilter} ${
                    priceRange === price.value ? kelas.tombolAktif : ''
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </aside>

          <div className={kelas.areaProduk}>
            {filteredProducts.length === 0 ? (
              <>
                {/* // 🔧 editable: ubah pesan ketika produk tidak ditemukan */}
                <div className={kelas.pesanKosong}>No products found</div>
              </>
            ) : (
              <div className={kelas.kisiProduk}>
                {filteredProducts.map((product) => (
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
                      {/* // 🔧 editable: atur format nama produk pada listing */}
                      <p className={kelas.namaProduk}>{product.name}</p>
                      {/* // 🔧 editable: sesuaikan format harga pada listing */}
                      <span className={kelas.hargaProduk}>
                        Rp {product.price.toLocaleString('id-ID')} IDR
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
