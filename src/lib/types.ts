export interface ProductImage {
  id: string;
  url: string;
  position: number | null;
}

export interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  price: number | null;
  stock: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  is_active: boolean;
  is_published: boolean;
  price: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category | null;
  stock?: number;
  featured?: boolean;
}
