import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useCart } from '@/context/CartContext';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { getAllProducts } from '@/lib/getProducts';
import type { Product } from '@/lib/types';

interface NavLink {
  label: string;
  path: string;
}

// 🔧 editable: sesuaikan daftar link navigasi dan tujuannya dengan halaman yang tersedia
const navLinks: NavLink[] = [
  { path: '/shop', label: 'Shop' },
  { path: '/shop?view=collection', label: 'Collection' },
  { path: '/shop?view=sale', label: 'Sale' },
  { path: '/about#campaign', label: 'Campaign' },
  { path: '/about#stores', label: 'Stores' },
];

// 🔧 editable: ubah pesan marquee promosi sesuai campaign berjalan
const marqueeMessages = [
  'Free Shipping Makassar & Maros',
  'Exclusive Drops Every Month',
];

const marqueeContent = marqueeMessages
  .map((message) => message.trim())
  .filter((message) => message.length > 0);

const kelas = {
  navigasi: 'fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10 shadow-sm',
  bannerPromo: 'hidden md:block bg-[#0127ff] text-white/90 text-[11px] uppercase tracking-[0.5em]',
  marqueePembungkus: 'marquee h-9 flex items-center overflow-hidden',
  marqueeLintasan: 'marquee__track',
  itemMarquee: 'mx-8 inline-block',
  kontainer: 'px-6 md:px-12',
  kisiBaris: 'flex h-20 items-center justify-between md:grid md:grid-cols-3 md:gap-6',
  daftarNavigasi: 'hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.4em] text-black/60',
  tautanNavigasiDasar: 'transition-colors duration-200',
  tautanNavigasiAktif: 'text-black',
  tautanNavigasiPasif: 'hover:text-black',
  pembungkusLogo: 'flex items-center md:justify-center',
  logo: 'text-2xl md:text-3xl font-bebas tracking-[0.45em] text-black',
  kelompokAksi: 'flex flex-1 items-center justify-end gap-3 text-black',
  tombolLingkaran: 'hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:border-black/40 transition',
  tombolKeranjang: 'relative flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:border-black/40 transition',
  lencanaKeranjang: 'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white',
  tombolMenu: 'flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:border-black/40 transition md:hidden',
  menuSeluler: 'md:hidden pb-6',
  daftarSeluler: 'flex flex-col gap-5 text-xs uppercase tracking-[0.4em] text-black/70',
  tautanSelulerDasar: 'transition-colors duration-200',
  pencarian: 'relative mr-auto flex-1 min-w-[180px] max-w-full md:mr-0 md:max-w-sm',
  pencarianKontrol: 'flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 transition focus-within:border-black',
  pencarianInput: 'w-full bg-transparent text-[11px] uppercase tracking-[0.3em] text-black placeholder:text-black/35 focus:outline-none',
  pencarianReset: 'text-black/30 transition hover:text-black',
  pencarianHasil: 'absolute left-0 right-0 top-full z-50 mt-2 space-y-1 rounded-2xl border border-black/10 bg-white py-3 shadow-[0_20px_35px_-22px_rgba(0,0,0,0.35)]',
  pencarianItem: 'flex w-full flex-col gap-1 px-4 py-2 text-left text-[11px] uppercase tracking-[0.3em] text-black/75 transition hover:bg-black hover:text-white',
  pencarianKategori: 'text-[10px] uppercase tracking-[0.4em] text-black/40',
  pencarianKosong: 'px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-black/40',
};

function useActiveChecker() {
  const location = useLocation();
  const matcher = useMemo(() => {
    const { pathname } = location;
    return (target: string) => {
      const [targetPath] = target.split('?');
      return pathname === targetPath;
    };
  }, [location]);

  return {
    isActive: matcher,
    location,
  };
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();
  const { isActive, location } = useActiveChecker();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const allProducts = useMemo<Product[]>(() => getAllProducts(), []);
  const trimmedQuery = searchQuery.trim();
  const searchResults = useMemo(() => {
    if (trimmedQuery.length === 0) {
      return [];
    }
    return fuzzySearch(trimmedQuery, allProducts).slice(0, 6);
  }, [allProducts, trimmedQuery]);
  const shouldShowResults = isSearchActive && trimmedQuery.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsSearchActive(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSelectResult = (product: Product) => {
    setSearchQuery('');
    setIsSearchActive(false);
    navigate(`/product/${product.handle}`);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  return (
    <nav className={kelas.navigasi}>
      {/* // 🔧 editable: ubah warna dasar dan border navbar sesuai tema */}
      {/* // 🔧 editable: ubah warna banner atas dan gaya teks sesuai palet brand */}
      <div className={kelas.bannerPromo}>
        <div className={kelas.marqueePembungkus}>
          <div className={kelas.marqueeLintasan}>
            {Array.from({ length: 4 }).map((_, loopIdx) =>
              marqueeContent.map((message, messageIdx) => (
                <span key={`${loopIdx}-${messageIdx}`} className={kelas.itemMarquee}>
                  {message}
                  <span aria-hidden="true"> •</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={kelas.kontainer}>
        <div className={kelas.kisiBaris}>
          <div className={kelas.daftarNavigasi}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`${kelas.tautanNavigasiDasar} ${
                  isActive(link.path) ? kelas.tautanNavigasiAktif : kelas.tautanNavigasiPasif
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={kelas.pembungkusLogo}>
            {/* // 🔧 editable: ganti teks logo header dan tujuan link ke halaman utama */}
            <Link
              to="/"
              className={kelas.logo}
            >
              ZEXALVA
            </Link>
          </div>

          <div className={kelas.kelompokAksi}>
            <div ref={searchRef} className={kelas.pencarian}>
              <form onSubmit={handleSearchSubmit} className={kelas.pencarianKontrol}>
                <Search className="h-4 w-4 text-black/30" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setIsSearchActive(true);
                  }}
                  onFocus={() => setIsSearchActive(true)}
                  className={kelas.pencarianInput}
                  aria-label="Cari produk ZEXALVA"
                />
                {trimmedQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchActive(false);
                    }}
                    className={kelas.pencarianReset}
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </form>

              {shouldShowResults && (
                <div className={kelas.pencarianHasil}>
                  {searchResults.length === 0 ? (
                    <p className={kelas.pencarianKosong}>Produk tidak ditemukan</p>
                  ) : (
                    searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectResult(product)}
                        className={kelas.pencarianItem}
                      >
                        <span>{product.name}</span>
                        <span className={kelas.pencarianKategori}>{product.category}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {/* // 🔧 editable: sesuaikan ikon dan label akun */}
            <button
              type="button"
              className={kelas.tombolLingkaran}
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </button>
            {/* // 🔧 editable: ubah style badge keranjang atau label aria */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={kelas.tombolKeranjang}
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className={kelas.lencanaKeranjang}>
                  {cartCount}
                </span>
              )}
            </button>
            {/* // 🔧 editable: ganti ikon menu mobile dan labelnya */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={kelas.tombolMenu}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={kelas.menuSeluler}>
            <div className={kelas.daftarSeluler}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${kelas.tautanSelulerDasar} ${
                    isActive(link.path) ? kelas.tautanNavigasiAktif : kelas.tautanNavigasiPasif
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
