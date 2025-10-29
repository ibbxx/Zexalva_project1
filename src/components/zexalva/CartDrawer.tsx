import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memo, useCallback, useMemo } from 'react';
import { useCart } from '@/context/CartContext';

// 🔧 editable: ganti locale formatter bila membutuhkan format mata uang berbeda
const currency = new Intl.NumberFormat('id-ID');

const kelas = {
  overlay: 'fixed inset-0 bg-black/40 z-40',
  laci: 'fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-[-20px_0_40px_rgba(0,0,0,0.12)] flex flex-col',
  kepala: 'flex items-center justify-between border-b border-black/10 px-6 py-5',
  judulDrawer: 'flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-black',
  tombolTutup: 'h-9 w-9 grid place-items-center border border-black/10',
  kosong: 'flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center text-black/60',
  ikonKosong: 'h-14 w-14 text-black/20',
  teksKosong: 'text-xs uppercase tracking-[0.3em]',
  tombolBelanja: 'border border-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white',
  daftarItem: 'flex-1 overflow-y-auto px-6 py-6',
  daftarIsi: 'space-y-6',
  kartuItem: 'grid gap-4 border border-black/10 p-4',
  kontenItem: 'flex gap-4',
  gambarItem: 'h-20 w-20 object-cover',
  detailItem: 'space-y-1 text-xs uppercase tracking-[0.3em] text-black',
  variasiItem: 'text-black/50',
  hargaItem: 'text-black/70',
  kontrolItem: 'flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/60',
  jumlahKontrol: 'flex items-center gap-3 border border-black/10 px-3 py-2',
  tombolHapus: 'text-black/40 hover:text-black',
  ringkasan: 'border-t border-black/10 px-6 py-6 space-y-4 text-xs uppercase tracking-[0.3em] text-black/60 bg-white',
  barisSubtotal: 'flex items-center justify-between text-black',
  tombolCheckout: 'w-full border border-black bg-black px-8 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black',
  tombolLanjutBelanja: 'w-full border border-black px-8 py-3 text-xs uppercase tracking-[0.4em] text-black transition hover:bg-black hover:text-white',
};

const CartDrawerComponent = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleOverlayClick = useCallback(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    navigate('/checkout');
  }, [navigate, setIsCartOpen]);

  const handleContinueShopping = useCallback(() => {
    setIsCartOpen(false);
    navigate('/shop');
  }, [navigate, setIsCartOpen]);

  const formattedSubtotal = useMemo(
    () => `Rp ${currency.format(getCartTotal())}`,
    // perf: optimized
    [cart, getCartTotal]
  );

  if (!isCartOpen) {
    return null;
  }

  return (
    <>
      {/* // 🔧 editable: atur warna overlay dan transparansi saat drawer terbuka */}
      <div className={kelas.overlay} onClick={handleOverlayClick} />

      <div className={kelas.laci}>
        <div className={kelas.kepala}>
          <div className={kelas.judulDrawer}>
            <ShoppingBag className="h-4 w-4" />
            {/* // 🔧 editable: ubah judul drawer keranjang sesuai tone brand */}
            <span>Your cart</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className={kelas.tombolTutup}
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className={kelas.kosong}>
            <ShoppingBag className={kelas.ikonKosong} />
            {/* // 🔧 editable: sesuaikan pesan kosong keranjang */}
            <p className={kelas.teksKosong}>Your cart is empty</p>
            {/* // 🔧 editable: ganti teks tombol ajakan berbelanja */}
            <button
              onClick={handleContinueShopping}
              className={kelas.tombolBelanja}
            >
              Shop now
            </button>
          </div>
        ) : (
          <>
            <div className={kelas.daftarItem}>
              <div className={kelas.daftarIsi}>
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className={kelas.kartuItem}
                  >
                    <div className={kelas.kontenItem}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className={kelas.gambarItem}
                      />
                      <div className={kelas.detailItem}>
                        <p>{item.product.name}</p>
                        <p className={kelas.variasiItem}>
                          {item.size} / {item.color}
                        </p>
                        {/* // 🔧 editable: atur format harga per item */}
                        <p className={kelas.hargaItem}>
                          Rp {currency.format(item.product.price)}
                        </p>
                      </div>
                    </div>

                    <div className={kelas.kontrolItem}>
                      <div className={kelas.jumlahKontrol}>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {/* // 🔧 editable: ganti teks aksi hapus item */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        className={kelas.tombolHapus}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={kelas.ringkasan}>
              {/* // 🔧 editable: ubah label subtotal atau format total sesuai kebutuhan */}
              <div className={kelas.barisSubtotal}>
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>

              {/* // 🔧 editable: ganti teks tombol menuju checkout */}
              <button onClick={handleCheckout} className={kelas.tombolCheckout}>
                Proceed to checkout
              </button>

              {/* // 🔧 editable: sesuaikan teks tombol kembali berbelanja */}
              <button onClick={handleContinueShopping} className={kelas.tombolLanjutBelanja}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default memo(CartDrawerComponent);
