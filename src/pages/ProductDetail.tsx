import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { useProductBySlug } from '@/hooks/useProductBySlug';

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
  pesanKosong: 'py-6 text-center text-sm uppercase tracking-[0.3em] text-black/40',
};

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slugParam = params.slug ?? '';
  const isSlugReady = Boolean(params.slug);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {
    data: product,
    loading,
    error,
  } = useProductBySlug(slugParam, { enabled: isSlugReady });
  const categorySlug = product?.category?.slug;
  const { data: relatedProductsRaw, loading: relatedLoading } = useProducts({
    categorySlug: categorySlug ?? undefined,
    enabled: Boolean(categorySlug),
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = useMemo(() => {
    if (!product) return [];
    const sizes = new Set<string>();
    product.variants.forEach((variant) => {
      if (variant.size) sizes.add(variant.size);
    });
    return Array.from(sizes);
  }, [product]);

  const colorOptions = useMemo(() => {
    if (!product) return [];
    const colors = new Set<string>();
    product.variants.forEach((variant) => {
      if (variant.color) colors.add(variant.color);
    });
    return Array.from(colors);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return relatedProductsRaw.filter((item) => item.id !== product.id).slice(0, 4);
  }, [product, relatedProductsRaw]);

  const totalStock = useMemo(
    () =>
      product?.variants.reduce((sum, variant) => sum + (variant.stock ?? 0), 0) ?? 0,
    [product]
  );

  if (loading) {
    return (
      <div className={kelas.halamanTidakDitemukan}>
        <div className={kelas.wadahTidakDitemukan}>
          <h2 className={kelas.judulTidakDitemukan}>Loading product...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={kelas.halamanTidakDitemukan}>
        <div className={kelas.wadahTidakDitemukan}>
          <h2 className={kelas.judulTidakDitemukan}>{error ?? 'Product not found'}</h2>
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
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (colorOptions.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

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
                src={product.images[selectedImage]?.url ?? product.images[0]?.url ?? ''}
                alt={product.name}
                className={kelas.gambarUtama}
              />
            </div>
            {product.images.length > 1 && (
              <div className={kelas.kisiThumbnail}>
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`${kelas.tombolThumbnail} ${
                      selectedImage === idx ? kelas.tombolThumbnailAktif : ''
                    }`}
                  >
                    <img src={img.url} alt={`${product.name} ${idx + 1}`} className={kelas.gambarThumbnail} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={kelas.kolomInformasi}>
            <div className={kelas.headerProduk}>
              {/* // 🔧 editable: ubah gaya penampilan kategori jika diperlukan */}
              <p className={kelas.kategori}>{product.category?.name ?? 'Uncategorized'}</p>
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
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${kelas.tombolPilihan} ${selectedSize === size ? kelas.tombolPilihanAktif : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {colorOptions.length > 0 && (
              <div className={kelas.blokPilihan}>
                <p className={kelas.labelPilihan}>Color</p>
                <div className={kelas.pilihanBaris}>
                  {colorOptions.map((color) => (
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
            )}

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
                <span>{totalStock} units</span>
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

        <section className={kelas.rekomendasi}>
          <h2 className={kelas.judulRekomendasi}>Kamu mungkin suka</h2>
          {relatedLoading ? (
            <div className={kelas.pesanKosong}>Loading related products...</div>
          ) : relatedProducts.length === 0 ? (
            <p className="text-sm text-black/40">Belum ada produk terkait.</p>
          ) : (
            <div className={kelas.kisiRekomendasi}>
              {relatedProducts.map((related) => (
                <button
                  key={related.id}
                  onClick={() => navigate(`/product/${related.slug}`)}
                  className={kelas.kartuRekomendasi}
                >
                  <div className={kelas.bingkaiRekomendasi}>
                    <img
                      src={related.images[0]?.url ?? ''}
                      alt={related.name}
                      className={kelas.gambarRekomendasi}
                    />
                  </div>
                  <span className={kelas.namaRekomendasi}>{related.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
