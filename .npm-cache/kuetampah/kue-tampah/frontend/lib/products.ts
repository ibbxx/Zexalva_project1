export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: {
    primary: string;
    secondary: string;
  };
  flavorNotes: string;
};

export const products: Product[] = [
  {
    id: 'tampah-premium',
    name: 'Tampah Premium Nusantara',
    description: 'Pilihan kue tradisional lengkap dengan tampilan cantik untuk acara spesial keluarga.',
    price: 450000,
    category: 'Tampah',
    images: {
      primary: '/images/tampah-premium.jpg',
      secondary: '/images/jajan-pasar.jpg',
    },
    flavorNotes: 'Gurih, manis legit, dan penuh tekstur tradisional.',
  },
  {
    id: 'jajan-pasar',
    name: 'Jajan Pasar Komplit',
    description: 'Aneka jajan pasar klasik seperti lapis legit, lemper, dadar gulung, dan nagasari.',
    price: 225000,
    category: 'Jajanan Pasar',
    images: {
      primary: '/images/jajan-pasar.jpg',
      secondary: '/images/klepon.jpg',
    },
    flavorNotes: 'Kombinasi rasa pandan, gula merah, dan kelapa parut.',
  },
  {
    id: 'snack-box',
    name: 'Snack Box Korporat',
    description: 'Kombinasi kue asin dan manis untuk rapat kantor atau seminar seharian.',
    price: 35000,
    category: 'Snack Box',
    images: {
      primary: '/images/snack-box.jpg',
      secondary: '/images/tampah-premium.jpg',
    },
    flavorNotes: 'Seimbang antara kue manis dan savory ringan.',
  },
  {
    id: 'tumpeng-mini',
    name: 'Tumpeng Mini Celebration',
    description: 'Nasi kuning mini lengkap lauk pendamping, cocok sebagai hantaran syukuran.',
    price: 55000,
    category: 'Tumpeng',
    images: {
      primary: '/images/tumpeng-mini.jpg',
      secondary: '/images/snack-box.jpg',
    },
    flavorNotes: 'Rempah nasi kuning dengan lauk pedas manis.',
  },
  {
    id: 'klepon',
    name: 'Klepon Gula Aren',
    description: 'Klepon kenyal isi gula aren cair, disajikan dengan kelapa parut yang gurih.',
    price: 28000,
    category: 'Tradisional',
    images: {
      primary: '/images/klepon.jpg',
      secondary: '/images/jajan-pasar.jpg',
    },
    flavorNotes: 'Kenyal legit dengan aroma pandan dan gula aren.',
  },
  {
    id: 'kue-kering',
    name: 'Kue Kering Signature',
    description: 'Toples kue kering premium seperti nastar, kastengel, dan putri salju.',
    price: 180000,
    category: 'Kue Kering',
    images: {
      primary: '/images/kue-kering.jpg',
      secondary: '/images/snack-box.jpg',
    },
    flavorNotes: 'Buttery, renyah, dan wangi keju premium.',
  },
];

export const getProductById = (id: string) => products.find((product) => product.id === id);
