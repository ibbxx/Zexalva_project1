import { supabase } from './supabaseClient';
import { slugify } from './slugify';

const DEFAULT_SLUG = 'produk';

export function generateSlug(name: string): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) {
    return '';
  }
  const slug = slugify(trimmed);
  return slug || DEFAULT_SLUG;
}

export async function isSlugUsed(slug: string): Promise<boolean> {
  const sanitized = slugify(slug);
  if (!sanitized) {
    return false;
  }
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('slug', sanitized);
  if (error) {
    console.error('failed to check slug', error);
    throw error;
  }
  return Boolean(count && count > 0);
}

export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const sanitizedBase = slugify(baseSlug) || DEFAULT_SLUG;
  let candidate = sanitizedBase;
  let attempt = 1;
  while (await isSlugUsed(candidate)) {
    candidate = `${sanitizedBase}-${attempt}`;
    attempt += 1;
  }
  return candidate;
}
