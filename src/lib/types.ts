export interface Product {
  id: string;
  name: string;
  handle: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
