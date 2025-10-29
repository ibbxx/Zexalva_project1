import productsData from '@/data/products.json';
import type { Category, Product } from './types';

const normalisedProducts = productsData as Product[];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const products = normalisedProducts;

export const getAllProducts = (): Product[] => products;

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

export const getProductByHandle = (handle: string): Product | undefined =>
  products.find((product) => product.handle === handle);

export const getFeaturedProducts = (): Product[] =>
  products.filter((product) => product.featured);

export const getCategories = (): Category[] => {
  const names = Array.from(new Set(products.map((product) => product.category)));
  return names.map((name, index) => ({
    id: String(index + 1),
    name,
    slug: slugify(name),
  }));
};

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((product) => product.category === category);
