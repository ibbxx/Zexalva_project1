import type { Product } from '@/lib/types';

export function fuzzySearch(query: string, products: Product[]): Product[] {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return [];
  }

  return products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(trimmedQuery);
    const categoryMatch = product.category.toLowerCase().includes(trimmedQuery);
    return nameMatch || categoryMatch;
  });
}
