import { Users, Target, Zap, Award } from 'lucide-react';

// 🔧 editable: ubah daftar nilai brand beserta ikon dan copywritingnya
const values = [
  {
    icon: Target,
    title: 'Authenticity',
    description: 'Setiap desain merekam DNA kultur urban Indonesia dengan jujur.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Eksperimen silhouette, tekstur, dan teknik wash untuk pengalaman berbeda.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Material premium, produksi terbatas, dan detail finishing yang presisi.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Membangun kolektif kreatif yang saling mendukung lintas kota dan skena.',
  },
];

const kelas = {
  halaman: 'min-h-screen bg-[#f5f4f2] pt-32 pb-24',
  pembungkus: 'mx-auto flex max-w-[1100px] flex-col gap-16 px-6',
  kepala: 'space-y-3 text-black',
  labelKecil: 'text-xs uppercase tracking-[0.6em] text-black/40',
  judulUtama: 'font-oswald text-4xl uppercase tracking-[0.35em]',
  deskripsiPembuka: 'text-sm leading-relaxed text-black/60 max-w-2xl',
  gridProfil: 'grid gap-12 md:grid-cols-2 md:items-center',
  kolomCerita: 'space-y-6 text-black',
  subJudul: 'font-oswald text-3xl uppercase tracking-[0.35em]',
  paragrafCerita: 'text-sm leading-relaxed text-black/65',
  bingkaiGambar: 'overflow-hidden bg-white shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)]',
  gambar: 'w-full object-cover',
  gridNilai: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-4',
  kartuNilai: 'space-y-3 bg-white p-8 text-black shadow-[0_18px_36px_-20px_rgba(0,0,0,0.15)]',
  ikonNilai: 'h-6 w-6 text-black',
  judulNilai: 'font-oswald text-lg uppercase tracking-[0.3em]',
  deskripsiNilai: 'text-sm leading-relaxed text-black/60',
  kampanye: 'space-y-6 bg-white p-10 text-black shadow-[0_25px_45px_-25px_rgba(0,0,0,0.2)]',
  headerSeksi: 'flex flex-col gap-2',
  labelSeksi: 'text-xs uppercase tracking-[0.4em] text-black/40',
  judulSeksi: 'font-oswald text-2xl uppercase tracking-[0.35em]',
  paragrafSeksi: 'text-sm leading-relaxed text-black/60',
  daftarToko: 'grid gap-6 bg-white p-10 text-black shadow-[0_25px_45px_-25px_rgba(0,0,0,0.2)]',
  daftarAlamat: 'space-y-3 text-sm leading-relaxed text-black/60',
};

export default function About() {
  return (
    <div className={kelas.halaman}>
      <div className={kelas.pembungkus}>
        <header className={kelas.kepala}>
          {/* // 🔧 editable: ubah label kecil halaman About */}
          <p className={kelas.labelKecil}>About us</p>
          {/* // 🔧 editable: ganti judul utama halaman About */}
          <h1 className={kelas.judulUtama}>ZEXALVA</h1>
          {/* // 🔧 editable: atur narasi pengantar brand */}
          <p className={kelas.deskripsiPembuka}>
            Brand streetwear yang lahir dari semangat pemberontakan dan ekspresi diri. Kami
            menata ulang wardrobe harian dengan paduan utilitarian, grafis bold, dan detail premium.
          </p>
        </header>

        <section className={kelas.gridProfil}>
          <div className={kelas.kolomCerita}>
            {/* // 🔧 editable: ganti subjudul cerita brand */}
            <h2 className={kelas.subJudul}>
              Everywhere
              Anywhere
              Somewhere
            </h2>
            {/* // 🔧 editable: sesuaikan paragraf sejarah brand */}
            <p className={kelas.paragrafCerita}>
              ZEXALVA berdiri pada 2025 sebagai respon atas kejenuhan fashion lokal yang seragam.
              Kami percaya pakaian bisa menjadi manifesto yang lantang—tentang identitas, kota,
              dan komunitas yang membesarkan kita.
            </p>
            {/* // 🔧 editable: ubah detail cerita rilisan */}
            <p className={kelas.paragrafCerita}>
              Setiap rilisan diproduksi dalam jumlah terbatas dengan perhatian khusus pada
              konstruksi dan pengalaman pemakai. Kami terobsesi pada detail, mulai dari bahan,
              hardware, hingga packaging.
            </p>
          </div>
          <div className={kelas.bingkaiGambar}>
            <img
              src="https://images.pexels.com/photos/8532621/pexels-photo-8532621.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Studio ZEXALVA"
              className={kelas.gambar}
            />
            {/* // 🔧 editable: ganti gambar dan alt text studio/about */}
          </div>
        </section>

        <section className={kelas.gridNilai}>
          {values.map((value) => (
            <div
              key={value.title}
              className={kelas.kartuNilai}
            >
              <value.icon className={kelas.ikonNilai} />
              <h3 className={kelas.judulNilai}>{value.title}</h3>
              <p className={kelas.deskripsiNilai}>{value.description}</p>
              {/* // 🔧 editable: sesuaikan judul dan deskripsi nilai brand */}
            </div>
          ))}
        </section>

        <section id="campaign" className={kelas.kampanye}>
          <div className={kelas.headerSeksi}>
            {/* // 🔧 editable: ubah label anchor campaign */}
            <p className={kelas.labelSeksi}>Campaign</p>
            {/* // 🔧 editable: ganti judul campaign */}
            <h3 className={kelas.judulSeksi}>Night Shift Capsule</h3>
          </div>
          {/* // 🔧 editable: sesuaikan deskripsi campaign */}
          <p className={kelas.paragrafSeksi}>
            Koleksi terbaru kami mengeksplorasi kontras lampu kota dan struktur industrial,
            menghasilkan palet monokrom dengan aksen elektrik. Silhouette oversized,
            tekstur washed, dan hardware fungsional menjadi kunci capsule ini.
          </p>
        </section>

        <section id="stores" className={kelas.daftarToko}>
          <div className={kelas.headerSeksi}>
            {/* // 🔧 editable: ubah label anchor gerai */}
            <p className={kelas.labelSeksi}>Stores</p>
            {/* // 🔧 editable: ganti judul daftar toko */}
            <h3 className={kelas.judulSeksi}>Flagship & stockist</h3>
          </div>
          {/* // 🔧 editable: perbarui daftar alamat toko */}
          <ul className={kelas.daftarAlamat}>
            <li>Maros — Jl. Poros Maros-Makassar No. 21</li>
            <li>Makassar — Jl. Sultan Alauddin No. 38</li>
            <li>Online — zexalva.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
