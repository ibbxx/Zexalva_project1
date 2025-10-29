import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { getAllProducts, getProductByHandle } from '@/lib/getProducts';
import { useCart } from '@/context/CartContext';

// 🔧 editable: ubah locale formatter untuk detail harga produk
const currency = new Intl.NumberFormat('id-ID');

const kelas = {
  halamanTidakDitemukan: 'min-h-screen bg-[#f5f4f2] pt-32 flex items-center justify-center px-6',
  wadahTidakDitemukan: 'text-center space-y-4',
  judulTidakDitemukan: 'font-oswald text-2xl uppercase tracking-[0.35em] text-black/50',
  tombolKembaliToko: 'border border-black px-6 py-3 text-xs uppercase tracking-[0.4em] text-black transition hover:bg-black hover:text-white',
  halaman: 'min-h-screen bg-[#f5f4f2] pt-32 pb-24',
  pembungkus: 'mx-auto flex max-w-[1100px] flex-col gap-16 px-6',
  tombolBack: 'flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-black/40 hover:text-black',
  kisiDetail: 'grid gap-12 md:grid-cols-2',
  kolomGambar: 'space-y-4',
  bingkaiGambar: 'bg-white p-6 shadow-[0_25px_45px_-25px_rgba(0,0,0,0.25)]',
  gambarUtama: 'w-full object-contain',
  kisiThumbnail: 'grid grid-cols-4 gap-4',
  tombolThumbnail: 'border border-black/10 bg-white p-2 transition hover:border-black',
  tombolThumbnailAktif: 'border-black',
  gambarThumbnail: 'w-full object-contain',
  kolomInformasi: 'space-y-8 text-black',
  headerProduk: 'space-y-2',
  kategori: 'text-xs uppercase tracking-[0.4em] text-black/40',
  judulProduk: 'font-oswald text-3xl uppercase tracking-[0.35em]',
  hargaProduk: 'text-sm uppercase tracking-[0.35em] text-black/60',
  deskripsi: 'text-sm leading-relaxed text-black/60',
  blokPilihan: 'space-y-3',
  labelPilihan: 'text-xs uppercase tracking-[0.35em] text-black/40',
  pilihanBaris: 'flex flex-wrap gap-3',
  tombolPilihan: 'border border-black/15 px-5 py-3 text-xs uppercase tracking-[0.35em] transition hover:border-black text-black',
  tombolPilihanAktif: 'bg-black text-white',
  kontrolJumlah: 'flex items-center gap-4 border border-black/15 bg-white px-4 py-2',
  nilaiJumlah: 'text-sm uppercase tracking-[0.35em]',
  tombolKeranjang: 'flex w-full items-center justify-center gap-3 border border-black bg-black px-8 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:bg-white hover:text-black',
  informasiTambahan: 'grid gap-2 text-xs uppercase tracking-[0.35em] text-black/50',
  barisInformasi: 'flex justify-between',
  rekomendasi: 'space-y-6 border-t border-black/10 pt-10',
  judulRekomendasi: 'font-oswald text-2xl uppercase tracking-[0.35em] text-black',
  kisiRekomendasi: 'grid gap-10 sm:grid-cols-2 lg:grid-cols-4',
  kartuRekomendasi: 'group flex flex-col items-center gap-4 text-black transition-transform duration-300 hover:-translate-y-2',
  bingkaiRekomendasi: 'bg-white p-6',
  gambarRekomendasi: 'w-full object-contain',
  namaRekomendasi: 'text-xs uppercase tracking-[0.35em] text-black/60 group-hover:text-black',
};

const products = getAllProducts();

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const product = getProductByHandle(handle ?? '');
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className={kelas.halamanTidakDitemukan}>
        <div className={kelas.wadahTidakDitemukan}>
          {/* // 🔧 editable: ubah pesan ketika produk tidak ditemukan */}
          <h2 className={kelas.judulTidakDitemukan}>Product not found</h2>
          {/* // 🔧 editable: ganti teks tombol kembali ke toko */}
          <button
            onClick={() => navigate('/shop')}
            className={kelas.tombolKembaliToko}
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      // 🔧 editable: sesuaikan pesan validasi sebelum menambahkan ke keranjang
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className={kelas.halaman}>
      <div className={kelas.pembungkus}>
        {/* // 🔧 editable: ganti label tombol kembali */}
        <button
          onClick={() => navigate('/shop')}
          className={kelas.tombolBack}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <section className={kelas.kisiDetail}>
          <div className={kelas.kolomGambar}>
            <div className={kelas.bingkaiGambar}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={kelas.gambarUtama}
              />
            </div>
            {product.images.length > 1 && (
              <div className={kelas.kisiThumbnail}>
                {product.images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(idx)}
                    className={`${kelas.tombolThumbnail} ${
                      selectedImage === idx ? kelas.tombolThumbnailAktif : ''
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className={kelas.gambarThumbnail} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={kelas.kolomInformasi}>
            <div className={kelas.headerProduk}>
              {/* // 🔧 editable: ubah gaya penampilan kategori jika diperlukan */}
              <p className={kelas.kategori}>{product.category}</p>
              {/* // 🔧 editable: atur format judul produk */}
              <h1 className={kelas.judulProduk}>{product.name}</h1>
              {/* // 🔧 editable: sesuaikan format harga produk */}
              <p className={kelas.hargaProduk}>
                Rp {currency.format(product.price)} IDR
              </p>
            </div>

            {/* // 🔧 editable: ganti deskripsi produk */}
            <p className={kelas.deskripsi}>{product.description}</p>

            <div className={kelas.blokPilihan}>
              {/* // 🔧 editable: ubah label pilihan ukuran */}
              <p className={kelas.labelPilihan}>Size</p>
              <div className={kelas.pilihanBaris}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${kelas.tombolPilihan} ${
                      selectedSize === size ? kelas.tombolPilihanAktif : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={kelas.blokPilihan}>
              {/* // 🔧 editable: ganti label pilihan warna */}
              <p className={kelas.labelPilihan}>Color</p>
              <div className={kelas.pilihanBaris}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`${kelas.tombolPilihan} ${
                      selectedColor === color ? kelas.tombolPilihanAktif : ''
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className={kelas.blokPilihan}>
              {/* // 🔧 editable: sesuaikan label jumlah beli */}
              <p className={kelas.labelPilihan}>Quantity</p>
              <div className={kelas.kontrolJumlah}>
                <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className={kelas.nilaiJumlah}>{quantity}</span>
                <button onClick={() => setQuantity((prev) => prev + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* // 🔧 editable: ganti teks tombol tambah ke keranjang */}
            <button
              onClick={handleAddToCart}
              className={kelas.tombolKeranjang}
            >
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </button>

            <div className={kelas.informasiTambahan}>
              <div className={kelas.barisInformasi}>
                <span>Stock</span>
                <span>{product.stock} units</span>
                {/* // 🔧 editable: atur label dan format stok */}
              </div>
              <div className={kelas.barisInformasi}>
                <span>Material</span>
                <span>Premium cotton</span>
                {/* // 🔧 editable: ubah detail komposisi material */}
              </div>
              <div className={kelas.barisInformasi}>
                <span>Shipping</span>
                <span>Free over Rp 500k</span>
                {/* // 🔧 editable: sesuaikan informasi pengiriman */}
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className={kelas.rekomendasi}>
            {/* // 🔧 editable: ubah judul rekomendasi produk */}
            <h2 className={kelas.judulRekomendasi}>Kamu mungkin suka</h2>
            <div className={kelas.kisiRekomendasi}>
              {relatedProducts.map((related) => (
                <button
                  key={related.id}
                  onClick={() => navigate(`/product/${related.handle}`)}
                  className={kelas.kartuRekomendasi}
                >
                  <div className={kelas.bingkaiRekomendasi}>
                    <img
                      src={related.images[0]}
                      alt={related.name}
                      className={kelas.gambarRekomendasi}
                    />
                  </div>
                  <span className={kelas.namaRekomendasi}>{related.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
