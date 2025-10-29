import { useNavigate } from 'react-router-dom';

const kelas = {
  bagianUtama: 'bg-white py-24',
  pembungkus: 'mx-auto flex max-w-[1100px] flex-col gap-10 px-6 md:flex-row md:items-end',
  kolomTeks: 'flex-1 space-y-4 text-black',
  label: 'text-xs uppercase tracking-[0.6em] text-black/40',
  judul: 'font-oswald text-3xl uppercase tracking-[0.35em]',
  deskripsi: 'text-sm leading-relaxed text-black/60 max-w-lg',
  formulir: 'flex w-full flex-col gap-4 md:flex-row md:items-center',
  inputEmail: 'w-full border border-black/20 bg-white px-5 py-3 text-sm uppercase tracking-[0.3em] text-black placeholder:text-black/30 focus:border-black',
  tombol: 'border border-black bg-black px-8 py-3 text-sm uppercase tracking-[0.35em] text-white transition hover:bg-white hover:text-black',
};

export default function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className={kelas.bagianUtama}>
      <div className={kelas.pembungkus}>
        <div className={kelas.kolomTeks}>
          {/* // 🔧 editable: ubah label section CTA */}
          <p className={kelas.label}>Newsletter</p>
          {/* // 🔧 editable: ganti judul CTA utama */}
          <h3 className={kelas.judul}>Stay ahead of the drop</h3>
          {/* // 🔧 editable: sesuaikan deskripsi CTA */}
          <p className={kelas.deskripsi}>
            Dapatkan akses awal ke rilisan terbatas, undangan pop-up, dan highlight kampanye langsung ke inbox kamu.
          </p>
        </div>

        <form
          className={kelas.formulir}
          onSubmit={(event) => {
            event.preventDefault();
            navigate('/shop');
          }}
        >
          <input
            type="email"
            required
            placeholder="Email"
            className={kelas.inputEmail}
          />
          {/* // 🔧 editable: ubah placeholder formulir */}
          {/* // 🔧 editable: ganti teks tombol CTA */}
          <button
            type="submit"
            className={kelas.tombol}
          >
            Join
          </button>
        </form>
      </div>
    </section>
  );
}
