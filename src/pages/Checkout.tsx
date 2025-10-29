import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// 🔧 editable: sesuaikan locale formatter untuk perhitungan checkout
const currency = new Intl.NumberFormat('id-ID');

const kelas = {
  halamanKosong: 'min-h-screen bg-[#f5f4f2] pt-32 px-6 flex items-center justify-center',
  wadahKosong: 'text-center space-y-4',
  judulKosong: 'font-oswald text-2xl uppercase tracking-[0.35em] text-black/50',
  tombolKosong: 'border border-black px-6 py-3 text-xs uppercase tracking-[0.4em] text-black transition hover:bg-black hover:text-white',
  halamanSukses: 'min-h-screen bg-[#f5f4f2] pt-32 px-6 flex items-center justify-center',
  kartuSukses: 'max-w-md w-full space-y-6 bg-white p-10 text-center shadow-[0_25px_45px_-25px_rgba(0,0,0,0.2)]',
  ikonSukses: 'mx-auto h-12 w-12 text-black',
  judulSukses: 'font-oswald text-2xl uppercase tracking-[0.35em]',
  deskripsiSukses: 'text-sm leading-relaxed text-black/60',
  tombolSukses: 'border border-black bg-black px-6 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black',
  halamanCheckout: 'min-h-screen bg-[#f5f4f2] pt-32 pb-24 px-6',
  tataLetak: 'mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[2fr_1fr]',
  kolomForm: 'space-y-10',
  kepala: 'space-y-3 text-black',
  labelKecil: 'text-xs uppercase tracking-[0.6em] text-black/40',
  judul: 'font-oswald text-3xl uppercase tracking-[0.35em]',
  formulir: 'space-y-8 text-xs uppercase tracking-[0.3em] text-black/60',
  blokForm: 'grid gap-4 bg-white p-8 shadow-[0_25px_45px_-25px_rgba(0,0,0,0.2)]',
  labelBlok: 'text-black/40',
  input: 'border border-black/15 px-4 py-3 text-xs uppercase tracking-[0.3em] text-black placeholder:text-black/30 focus:border-black',
  kisiDua: 'grid gap-4 md:grid-cols-2',
  pilihanPembayaran: 'grid gap-3 bg-white p-8 shadow-[0_25px_45px_-25px_rgba(0,0,0,0.2)]',
  labelPembayaran: 'flex items-center gap-3 border border-black/15 px-4 py-3',
  tombolSubmit: 'w-full border border-black bg-black px-8 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black',
  ringkasan: 'space-y-6 bg-white p-8 text-xs uppercase tracking-[0.3em] text-black/60 shadow-[0_25px_45px_-25px_rgba(0,0,0,0.2)]',
  daftarRingkasan: 'space-y-4',
  itemRingkasan: 'space-y-2',
  barisRingkasan: 'flex justify-between',
  detailVarian: 'text-[11px] text-black/40',
  blokTotal: 'space-y-2 border-t border-black/10 pt-4',
  barisTotal: 'flex justify-between',
  barisPengiriman: 'flex justify-between text-black/40',
  barisGrandTotal: 'flex justify-between text-black font-semibold',
  progressWrapper: 'mb-10',
  progress: 'flex items-center gap-3 text-[11px] uppercase tracking-[0.35em]',
  progressItem: 'flex flex-1 items-center gap-3',
  stepInfo: 'flex min-w-[90px] flex-col items-center gap-2 text-center',
  stepCircle: 'flex h-10 w-10 items-center justify-center rounded-full border-2 border-black/15 text-xs font-semibold text-black/40 transition',
  stepCircleAktif: 'border-blue-500 bg-blue-500 text-white',
  stepLabel: 'text-[10px] uppercase tracking-[0.35em] text-black/30',
  stepLabelAktif: 'text-black',
  stepConnector: 'flex-1 h-[2px] rounded-full bg-black/10',
  stepConnectorAktif: 'bg-blue-500',
};

const checkoutSteps = [
  { id: 1, label: 'Data diri' },
  { id: 2, label: 'Pembayaran' },
  { id: 3, label: 'Konfirmasi' },
] as const;

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'bank_transfer',
  });
  // 🔧 editable: atur field awal form checkout

  const isShippingComplete = useMemo(() => {
    const requiredFields: Array<keyof typeof formData> = ['name', 'email', 'phone', 'address', 'city', 'postalCode'];
    return requiredFields.every((field) => {
      const value = formData[field];
      return typeof value === 'string' && value.trim().length > 0;
    });
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setCurrentStep(3);
      return;
    }

    if (isShippingComplete) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [isShippingComplete, isSuccess]);

  const ProgressBar = () => (
    <div className={kelas.progress}>
      {checkoutSteps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isReached = isCompleted || isActive;

        return (
          <div key={step.id} className={kelas.progressItem}>
            <div className={kelas.stepInfo}>
              <div
                className={`${kelas.stepCircle} ${isReached ? kelas.stepCircleAktif : ''}`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className={`${kelas.stepLabel} ${isReached ? kelas.stepLabelAktif : ''}`}>
                {step.label}
              </span>
            </div>
            {index < checkoutSteps.length - 1 && (
              <div
                className={`${kelas.stepConnector} ${
                  currentStep > step.id ? kelas.stepConnectorAktif : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSuccess(true);
    setCurrentStep(3);
    clearCart();
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className={kelas.halamanKosong}>
        <div className={kelas.wadahKosong}>
          {/* // 🔧 editable: ubah pesan ketika keranjang kosong di checkout */}
          <h2 className={kelas.judulKosong}>Cart is empty</h2>
          {/* // 🔧 editable: ganti teks tombol kembali belanja */}
          <button
            onClick={() => navigate('/shop')}
            className={kelas.tombolKosong}
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={kelas.halamanSukses}>
        <div className="w-full max-w-md space-y-6">
          <div className={kelas.progressWrapper}>
            <ProgressBar />
          </div>
          <div className={kelas.kartuSukses}>
            <CheckCircle2 className={kelas.ikonSukses} />
            {/* // 🔧 editable: ubah judul halaman sukses checkout */}
            <h2 className={kelas.judulSukses}>Order confirmed</h2>
            {/* // 🔧 editable: ganti copy notifikasi sukses */}
            <p className={kelas.deskripsiSukses}>
              Pesananmu sudah kami terima. Tim ZEXALVA akan menghubungi kamu untuk informasi pengiriman.
            </p>
            {/* // 🔧 editable: ganti teks tombol setelah checkout sukses */}
            <button
              onClick={() => navigate('/shop')}
              className={kelas.tombolSukses}
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={kelas.halamanCheckout}>
      <div className={kelas.tataLetak}>
        <div className={kelas.kolomForm}>
          <div className={kelas.progressWrapper}>
            <ProgressBar />
          </div>
          <header className={kelas.kepala}>
            {/* // 🔧 editable: ubah label kecil header checkout */}
            <p className={kelas.labelKecil}>Checkout</p>
            {/* // 🔧 editable: ganti judul utama halaman checkout */}
            <h1 className={kelas.judul}>Order details</h1>
          </header>

          <form onSubmit={handleSubmit} className={kelas.formulir}>
            <section className={kelas.blokForm}>
              {/* // 🔧 editable: ganti subjudul informasi pengiriman */}
              <p className={kelas.labelBlok}>Shipping information</p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap*"
                required
                className={kelas.input}
              />
              {/* // 🔧 editable: sesuaikan placeholder nama */}
              <div className={kelas.kisiDua}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email*"
                  required
                  className={kelas.input}
                />
                {/* // 🔧 editable: ganti placeholder email */}
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telepon*"
                  required
                  className={kelas.input}
                />
                {/* // 🔧 editable: ubah placeholder telepon */}
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Alamat lengkap*"
                required
                rows={3}
                className={kelas.input}
              />
              {/* // 🔧 editable: sesuaikan placeholder alamat */}
              <div className={kelas.kisiDua}>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Kota*"
                  required
                  className={kelas.input}
                />
                {/* // 🔧 editable: ubah placeholder kota */}
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Kode pos*"
                  required
                  className={kelas.input}
                />
                {/* // 🔧 editable: ganti placeholder kode pos */}
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Catatan (opsional)"
                rows={2}
                className={kelas.input}
              />
              {/* // 🔧 editable: atur placeholder catatan tambahan */}
            </section>

            <section className={kelas.pilihanPembayaran}>
              {/* // 🔧 editable: ganti judul metode pembayaran */}
              <p className={kelas.labelBlok}>Payment method</p>
              <label className={kelas.labelPembayaran}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleChange}
                />
                {/* // 🔧 editable: sesuaikan label metode transfer bank */}
                <span>Transfer bank (simulasi)</span>
              </label>
              <label className={kelas.labelPembayaran}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                {/* // 🔧 editable: ganti label metode COD */}
                <span>COD (simulasi)</span>
              </label>
            </section>

            {/* // 🔧 editable: ubah teks tombol submit checkout */}
            <button
              type="submit"
              className={kelas.tombolSubmit}
            >
              Place order
            </button>
          </form>
        </div>

        <aside className={kelas.ringkasan}>
          {/* // 🔧 editable: ganti judul ringkasan pesanan */}
          <p className={kelas.labelBlok}>Order summary</p>
          <div className={kelas.daftarRingkasan}>
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className={kelas.itemRingkasan}>
                <div className={kelas.barisRingkasan}>
                  <span>{item.product.name}</span>
                  {/* // 🔧 editable: atur format tampilan harga per item di ringkasan */}
                  <span>Rp {currency.format(item.product.price * item.quantity)}</span>
                </div>
                {/* // 🔧 editable: sesuaikan format detail varian produk */}
                <p className={kelas.detailVarian}>
                  {item.size} / {item.color} × {item.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className={kelas.blokTotal}>
            <div className={kelas.barisTotal}>
              <span>Subtotal</span>
              {/* // 🔧 editable: ganti label subtotal dan format angka */}
              <span>Rp {currency.format(getCartTotal())}</span>
            </div>
            <div className={kelas.barisPengiriman}>
              <span>Shipping</span>
              {/* // 🔧 editable: ubah informasi biaya pengiriman */}
              <span>Free</span>
            </div>
            <div className={kelas.barisGrandTotal}>
              <span>Total</span>
              {/* // 🔧 editable: sesuaikan label total pembayaran */}
              <span>Rp {currency.format(getCartTotal())}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
