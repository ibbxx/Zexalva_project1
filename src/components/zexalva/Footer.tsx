import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 3h3a6 6 0 0 0 6 6v3a8.99 8.99 0 0 1-6-2.4V16a5 5 0 1 1-5-5h1.5V3Z" />
  </svg>
);

// 🔧 editable: ganti daftar link menu About sesuai struktur situs
const aboutLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/about#contact' },
  { label: 'FAQ', path: '/about#faq' },
  { label: 'Career', path: '/about#career' },
];

// 🔧 editable: ubah link komunitas atau sosial media brand
const clubLinks = [
  { label: 'Stores', path: '/about#stores' },
  { label: 'Instagram', path: 'https://www.instagram.com/zexalva/' },
  { label: 'TikTok', path: 'https://www.tiktok.com/@zexalva' },
];

const kelas = {
  bagianUtama: 'bg-white py-20',
  pembungkus: 'mx-auto flex max-w-[1100px] flex-col gap-14 px-6',
  kisiAtas: 'grid gap-10 md:grid-cols-3 text-sm text-black/70',
  kolomTautan: 'space-y-3',
  labelKolom: 'text-xs uppercase tracking-[0.4em] text-black/40',
  daftarTautan: 'space-y-2',
  tautanTeks: 'uppercase tracking-[0.35em] hover:text-black',
  kolomNewsletter: 'space-y-4 text-black',
  deskripsiNewsletter: 'text-sm text-black/60 max-w-xs',
  formulirNewsletter: 'flex w-full max-w-md items-center gap-2 border-b border-black',
  inputNewsletter: 'w-full bg-transparent py-2 text-xs uppercase tracking-[0.4em] text-black placeholder:text-black/30 focus:outline-none',
  tombolNewsletter: 'text-xs uppercase tracking-[0.4em] text-black/60 hover:text-black',
  catatan: 'text-[11px] text-black/40 max-w-sm',
  grupIkon: 'flex gap-3 text-black/60',
  ikonLingkaran: 'flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:border-black transition',
  barisBawah: 'flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-black/40 md:flex-row md:items-center md:justify-between',
  tautanLegal: 'flex gap-4',
  tautanLegalItem: 'hover:text-black',
};

export default function Footer() {
  return (
    <footer className={kelas.bagianUtama}>
      <div className={kelas.pembungkus}>
        <div className={kelas.kisiAtas}>
          <div className={kelas.kolomTautan}>
            <p className={kelas.labelKolom}>About us</p>
            {/* // 🔧 editable: ubah judul section informasi brand */}
            <ul className={kelas.daftarTautan}>
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  {link.path.startsWith('http') ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noreferrer"
                      className={kelas.tautanTeks}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={kelas.tautanTeks}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={kelas.kolomTautan}>
            <p className={kelas.labelKolom}>Zexalva club</p>
            {/* // 🔧 editable: ganti judul dan isi daftar komunitas */}
            <ul className={kelas.daftarTautan}>
              {clubLinks.map((link) => (
                <li key={link.label}>
                  {link.path.startsWith('http') ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noreferrer"
                      className={kelas.tautanTeks}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={kelas.tautanTeks}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={kelas.kolomNewsletter}>
            <p className={kelas.labelKolom}>Newsletter</p>
            {/* // 🔧 editable: atur judul newsletter sesuai kebutuhan */}
            <p className={kelas.deskripsiNewsletter}>
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              {/* // 🔧 editable: ubah deskripsi newsletter */}
            </p>
            <form
              className={kelas.formulirNewsletter}
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Email"
                className={kelas.inputNewsletter}
              />
              {/* // 🔧 editable: ganti teks tombol newsletter */}
              <button
                type="submit"
                className={kelas.tombolNewsletter}
              >
                Join
              </button>
            </form>
            <p className={kelas.catatan}>
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              {/* // 🔧 editable: sesuaikan disclaimer bila perlu */}
            </p>
            <div className={kelas.grupIkon}>
              <a
                href="https://www.instagram.com/zexalva/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={kelas.ikonLingkaran}
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@zexalva"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className={kelas.ikonLingkaran}
              >
                <TikTokIcon />
              </a>
              {/* // 🔧 editable: ubah atau tambah ikon sosial media dan tautannya */}
            </div>
          </div>
        </div>

        <div className={kelas.barisBawah}>
          <span>© {new Date().getFullYear()} ZEXALVA. All rights reserved.</span>
          {/* // 🔧 editable: sesuaikan footer copyright */}
          <div className={kelas.tautanLegal}>
            <Link to="/about#privacy" className={kelas.tautanLegalItem}>
              Privacy Policy
            </Link>
            <Link to="/about#terms" className={kelas.tautanLegalItem}>
              Terms of Service
            </Link>
            {/* // 🔧 editable: ganti link legal sesuai halaman yang tersedia */}
          </div>
        </div>
      </div>
    </footer>
  );
}
