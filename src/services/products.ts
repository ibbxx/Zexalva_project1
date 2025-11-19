import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Category, Product, ProductImage } from '@/lib/types';

/**
 * products → categories = products_category_id_fkey
 * products → product_images = product_images_product_id_fkey
 * products → product_variants = product_variants_product_id_fkey
 */

const PRODUCT_SELECT = `
  id,
  name,
  slug,
  description,
  price,
  featured,
  is_active,
  is_published,
  category_id,
  product_images:product_images_product_id_fkey (
    id,
    url,
    position
  ),
  product_variants:product_variants_product_id_fkey (
    id,
    size,
    color,
    stock
  ),
  category:products_category_id_fkey (
    id,
    name,
    slug
  )
`;

type CategoryRelation =
  | { id?: string | number; name?: string | null; slug?: string | null }
  | Array<{ id?: string | number; name?: string | null; slug?: string | null }>
  | null;

interface ProductImageRecord {
  id?: string | number;
  url?: string | null;
  position?: number | null;
}

interface ProductRecord {
  id: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  price?: number | null;
  featured?: boolean | null;
  is_active?: boolean | null;
  is_published?: boolean | null;
  category_id?: string | number | null;
  product_images?: ProductImageRecord[];
  product_variants?: Array<{
    id?: string | number;
    size?: string | null;
    color?: string | null;
    stock?: number | null;
  }>;
  category?: CategoryRelation;
}

const mapImages = (images?: ProductImageRecord[]): ProductImage[] =>
  (images ?? [])
    .filter((img): img is ProductImageRecord & { url: string } => Boolean(img?.url))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((img, index) => ({
      id: img.id ? String(img.id) : `img-${index}`,
      url: img.url,
      position: img.position ?? null,
    }));

const resolveCategory = (relation: CategoryRelation): Category | null => {
  if (!relation) return null;
  const payload = Array.isArray(relation) ? relation[0] : relation;
  if (!payload?.name && !payload?.slug) return null;

  return {
    id: payload.id ? String(payload.id) : '',
    name: payload.name ?? '',
    slug: payload.slug ?? '',
  };
};

const mapProduct = (record: ProductRecord): Product => {
  const category = resolveCategory(record.category ?? null);

  const totalStock =
    record.product_variants?.reduce((sum, variant) => sum + Number(variant.stock ?? 0), 0) ?? 0;

  return {
    id: String(record.id),
    name: record.name ?? '',
    slug: record.slug ?? '',
    description: record.description ?? '',
    price: Number(record.price ?? 0),
    is_active: Boolean(record.is_active ?? true),
    is_published: Boolean(record.is_published ?? true),
    category_id: record.category_id ? String(record.category_id) : null,
    category,
    images: mapImages(record.product_images),
    variants:
      record.product_variants?.map((variant, index) => ({
        id: variant.id ? String(variant.id) : `variant-${record.id}-${index}`,
        size: variant.size ?? '',
        color: variant.color ?? '',
        price: null,
        stock: Number(variant.stock ?? 0),
      })) ?? [],
    stock: totalStock,
    featured: Boolean(record.featured),
  };
};

const applyVisibilityFilters = (query: any, includeInactive?: boolean) =>
  includeInactive ? query : query.eq('is_active', true).eq('is_published', true);

type ServiceResponse<T> = Promise<{
  data: T;
  error: PostgrestError | null;
}>;

/* =====================================================================
   GET ALL PRODUCTS
===================================================================== */
export async function getAllProducts(
  options?: { includeInactive?: boolean }
): ServiceResponse<Product[]> {
  const baseQuery = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false });

  const query = applyVisibilityFilters(baseQuery, options?.includeInactive);

  const { data, error } = await query;

  if (error) return { data: [], error };

  return { data: (data ?? []).map(mapProduct), error: null };
}

/* =====================================================================
   GET PRODUCT BY SLUG
===================================================================== */
export async function getProductBySlug(
  slug: string,
  options?: { includeInvisible?: boolean }
): ServiceResponse<Product | null> {
  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .limit(1);

  if (!options?.includeInvisible) {
    query = query.eq('is_active', true).eq('is_published', true);
  }

  const { data, error } = await query.single();

  if (error) return { data: null, error };

  return { data: data ? mapProduct(data) : null, error: null };
}

/* =====================================================================
   GET PRODUCTS BY CATEGORY
===================================================================== */
export async function getProductsByCategorySlug(
  slug: string
): ServiceResponse<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category.slug', slug)
    .eq('is_active', true)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error };

  return { data: (data ?? []).map(mapProduct), error: null };
}

/* =====================================================================
   GET FEATURED
===================================================================== */
export async function getFeaturedProducts(): ServiceResponse<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('featured', true)
    .eq('is_active', true)
    .eq('is_published', true)
    .limit(6);

  if (error) return { data: [], error };

  return { data: (data ?? []).map(mapProduct), error: null };
}

/* =====================================================================
   GET PRODUCT VARIANTS (ADMIN)
===================================================================== */
export async function getProductVariants(
  productId: string
): ServiceResponse<ProductVariantRow[]> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('id, size, color, stock')
    .eq('product_id', productId)
    .order('size', { ascending: true })
    .order('color', { ascending: true });

  if (error) {
    return { data: [], error };
  }

  const variants =
    data?.map((variant) => ({
      id: String(variant.id),
      size: variant.size ?? '',
      color: variant.color ?? '',
      stock: Number(variant.stock ?? 0),
    })) ?? [];

  return { data: variants, error: null };
}

/* =====================================================================
   CREATE PRODUCT
===================================================================== */
export interface ProductWritePayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  is_active: boolean;
  is_published: boolean;
  category_id: string | number | null;
  featured?: boolean;
}

export interface ProductVariantInput {
  size: string;
  color: string;
  stock: number;
  hasStockInput?: boolean;
}

export interface ProductVariantRow extends ProductVariantInput {
  id: string;
}

const normalizeCategoryId = (value: string | number | null | undefined) =>
  value === '' || value === undefined ? null : value;

const normalizeVariants = (variants: ProductVariantInput[] | undefined, productId: string) =>
  (variants ?? [])
    .map((v) => {
      const size = (v.size ?? '').trim();
      const color = (v.color ?? '').trim();
      const rawStock = Number.isFinite(v.stock) ? Number(v.stock) : 0;
      const stock = Math.max(0, Math.trunc(rawStock));
      const hasStockInput = v.hasStockInput ?? Number.isFinite(v.stock);
      if (!size && !color && !hasStockInput) {
        return null;
      }
      return {
        product_id: productId,
        size,
        color,
        stock,
      };
    })
    .filter((variant): variant is { product_id: string; size: string; color: string; stock: number } =>
      Boolean(variant)
    );

const normalizeImages = (images: string[], productId: string) =>
  images
    .filter((url) => /^https?:\/\//i.test(url))
    .map((url, index) => ({
      product_id: productId,
      url,
      position: index,
    }));

export async function createProduct(
  payload: ProductWritePayload,
  images: string[],
  variants: ProductVariantInput[] = []
): ServiceResponse<Product | null> {
  const basePayload = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    price: payload.price,
    is_active: payload.is_active,
    is_published: payload.is_published,
    category_id: normalizeCategoryId(payload.category_id),
    featured: payload.featured ?? false,
  };

  const { data, error } = await supabase
    .from('products')
    .insert([basePayload])
    .select('id')
    .single();

  if (error || !data) return { data: null, error };

  const productId = String(data.id);

  const imgPayload = normalizeImages(images, productId);
  if (imgPayload.length) {
    const { error: galleryError } = await supabase
      .from('product_images')
      .insert(imgPayload);
    if (galleryError) return { data: null, error: galleryError };
  }

  const variantPayload = normalizeVariants(variants, productId);
  if (variantPayload.length) {
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variantPayload);
    if (variantError) return { data: null, error: variantError };
  }

  const { data: productRecord, error: fetchError } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', productId)
    .single();

  if (fetchError || !productRecord)
    return { data: null, error: fetchError ?? null };

  return { data: mapProduct(productRecord), error: null };
}

/* =====================================================================
   UPDATE PRODUCT
===================================================================== */
export async function updateProduct(
  id: string,
  payload: ProductWritePayload,
  images: string[],
  variants: ProductVariantInput[] = []
): ServiceResponse<Product | null> {
  const basePayload = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    price: payload.price,
    is_active: payload.is_active,
    is_published: payload.is_published,
    category_id: normalizeCategoryId(payload.category_id),
    featured: payload.featured ?? false,
  };

  const { error } = await supabase
    .from('products')
    .update(basePayload)
    .eq('id', id);

  if (error) return { data: null, error };

  await supabase.from('product_images').delete().eq('product_id', id);
  const imgPayload = normalizeImages(images, id);
  if (imgPayload.length) {
    await supabase.from('product_images').insert(imgPayload);
  }

  await supabase.from('product_variants').delete().eq('product_id', id);
  const variantPayload = normalizeVariants(variants, id);
  if (variantPayload.length) {
    const { error: variantError } = await supabase.from('product_variants').insert(variantPayload);
    if (variantError) return { data: null, error: variantError };
  }

  const { data: productRecord, error: fetchError } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single();

  if (fetchError || !productRecord)
    return { data: null, error: fetchError ?? null };

  return { data: mapProduct(productRecord), error: null };
}

/* =====================================================================
   DELETE PRODUCT
===================================================================== */
export async function deleteProduct(
  id: string
): ServiceResponse<{ id: string } | null> {
  await supabase.from('product_images').delete().eq('product_id', id);
  await supabase.from('product_variants').delete().eq('product_id', id);

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) return { data: null, error };

  return { data: { id }, error: null };
}
