/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import Breadcrumb from '@/components/admin/Breadcrumb';
import AdminCard from '@/components/admin/AdminCard';
import Button from '@/components/admin/Button';
import Skeleton from '@/components/admin/Skeleton';
import { Toast, useToast } from '@/components/admin/Toast';
import ImageUrlUploader, { type ImageUrlItem } from '@/components/admin/ImageUrlUploader';
import { getCategories } from '@/services/categories';
import AddCategoryModal from '@/components/admin/AddCategoryModal';
import ManageCategoriesModal from '@/components/admin/ManageCategoriesModal';
import { getProductVariants, updateProduct, type ProductVariantInput } from '@/services/products';
import { slugify } from '@/lib/slugify';
import { ensureUniqueSlug, generateSlug, isSlugUsed } from '@/lib/slugUtils';

interface CategoryRecord {
  id: string | number;
  name: string;
}

interface VariantFormValue {
  id: string;
  size: string;
  color: string;
  stock: string;
}

type VariantField = keyof Omit<VariantFormValue, 'id'>;

const createEmptyVariant = (): VariantFormValue => ({
  id: `variant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  size: '',
  color: '',
  stock: '',
});

export default function ProductsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, show } = useToast();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    price: 0,
    is_active: true,
    is_published: true,
  });

  const [isSlugSynced, setIsSlugSynced] = useState(true);
  const [slugError, setSlugError] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');

  const [images, setImages] = useState<ImageUrlItem[]>([]);
  const [variants, setVariants] = useState<VariantFormValue[]>([createEmptyVariant()]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showManageCategories, setShowManageCategories] = useState(false);

  /* load categories */
  useEffect(() => {
    let active = true;
    getCategories().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('failed to load categories:', error);
        show('gagal memuat kategori');
      } else {
        setCategories(data ?? []);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  /* safe load product + images separately (fix failed to fetch) */
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);

      try {
        /* --- LOAD PRODUCT (safe) --- */
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        /* fill form */
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          description: data.description ?? '',
          price: data.price ?? 0,
          is_active: Boolean(data.is_active),
          is_published: Boolean(data.is_published),
          category_id: data.category_id ? String(data.category_id) : '',
        });

        setOriginalSlug(data.slug ?? '');

        /* --- LOAD IMAGES SEPARATELY (fix nested error) --- */
        const { data: imageRecords } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', data.id)
          .order('position', { ascending: true });

        const sortedImages = (imageRecords ?? []).map((img) => ({
          url: img.url ?? '',
        }));

        setImages(sortedImages);

        /* --- LOAD VARIANTS --- */
        const { data: variantRecords, error: variantError } = await getProductVariants(String(data.id));

        if (variantError) {
          console.error('failed to load product variants:', variantError);
          show('gagal memuat varian produk');
        }

        const nextVariants = (variantRecords ?? []).map((variant) => ({
          id: variant.id ? String(variant.id) : createEmptyVariant().id,
          size: variant.size ?? '',
          color: variant.color ?? '',
          stock: String(variant.stock ?? ''),
        }));

        setVariants(nextVariants.length ? nextVariants : [createEmptyVariant()]);
      } catch (err) {
        console.error('failed to load product:', err);
        show('gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /* auto slug */
  useEffect(() => {
    if (!isSlugSynced) return;
    setForm((prev) => {
      const generated = generateSlug(prev.name);
      if (prev.slug === generated) return prev;
      return { ...prev, slug: generated };
    });
  }, [form.name, isSlugSynced]);

  /* slug validation */
  const validateSlug = useCallback(
    async (value: string, opts: { promptOnDuplicate?: boolean; resyncOnEmpty?: boolean } = {}) => {
      const { promptOnDuplicate = false, resyncOnEmpty = false } = opts;

      const trimmed = value.trim();
      const normalizedOriginal = originalSlug.trim();

      if (!trimmed) {
        const base = generateSlug(form.name);
        if (!base) {
          if (resyncOnEmpty) setIsSlugSynced(true);
          setSlugError('');
          return '';
        }
        try {
          const unique = await ensureUniqueSlug(base);
          setForm((p) => ({ ...p, slug: unique }));
          if (resyncOnEmpty) setIsSlugSynced(true);
          setSlugError('');
          return unique;
        } catch (e) {
          console.error(e);
          show('gagal memvalidasi slug');
          return null;
        }
      }

      if (normalizedOriginal && trimmed === normalizedOriginal) {
        setSlugError('');
        return trimmed;
      }

      try {
        const used = await isSlugUsed(trimmed);
        if (used) {
          setSlugError('slug telah dipakai');
          if (promptOnDuplicate) {
            const shouldAuto = window.confirm('slug telah dipakai. ingin generate slug unik otomatis?');
            if (shouldAuto) {
              try {
                const unique = await ensureUniqueSlug(trimmed);
                setForm((p) => ({ ...p, slug: unique }));
                setSlugError('');
                return unique;
              } catch (e) {
                console.error(e);
                show('gagal memvalidasi slug');
                return null;
              }
            }
          }
          return null;
        }
        setSlugError('');
        return trimmed;
      } catch (e) {
        console.error(e);
        show('gagal memvalidasi slug');
        return null;
      }
    },
    [form.name, originalSlug]
  );

  /* variant sanitizer (size/color/stock opsional) */
  const buildVariantPayload = useCallback((): ProductVariantInput[] => {
    const sanitized: ProductVariantInput[] = [];

    variants.forEach((v) => {
      const size = v.size.trim();
      const color = v.color.trim();
      const stockStr = v.stock.trim();

      const hasStockInput = stockStr !== '';
      const parsed = hasStockInput ? Number.parseInt(stockStr, 10) : 0;
      const stockValue = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);

      /* skip empty row */
      if (!size && !color && !hasStockInput) return;

      sanitized.push({
        size,
        color,
        stock: stockValue,
        hasStockInput,
      });
    });

    return sanitized;
  }, [variants]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((p) => ({ ...p, [name]: checked }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setForm((p) => ({ ...p, category_id: value }));
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSlugSynced(false);
    const sanitized = slugify(e.target.value);
    setSlugError('');
    setForm((p) => ({ ...p, slug: sanitized }));
  };

  const handleSlugBlur = () => {
    void validateSlug(form.slug, { promptOnDuplicate: true, resyncOnEmpty: true });
  };

  const handleVariantChange = (variantId: string, field: VariantField, value: string) => {
    setVariants((prev) =>
      prev.map((variant) => (variant.id === variantId ? { ...variant, [field]: value } : variant))
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, createEmptyVariant()]);

  const removeVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const imageUrls = useMemo(
    () => images.filter((img) => /^https?:\/\//i.test(img.url)).map((img) => img.url),
    [images]
  );

  /* submit */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    if (!form.category_id) {
      show('pilih kategori terlebih dahulu');
      return;
    }

    const finalSlug = await validateSlug(form.slug, { promptOnDuplicate: true, resyncOnEmpty: true });
    if (!finalSlug) return;

    const variantPayload = buildVariantPayload();

    setSaving(true);

    try {
      const { error } = await updateProduct(
        id,
        {
          name: form.name,
          slug: finalSlug,
          description: form.description,
          price: Number(form.price),
          is_active: form.is_active,
          is_published: form.is_published,
          category_id: form.category_id,
        },
        imageUrls,
        variantPayload
      );

      if (error) throw error;

      show('produk diperbarui');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      show('gagal memperbarui produk');
    } finally {
      setSaving(false);
    }
  };

  /* render ui */
  return (
    <div className="space-y-8">
      <Breadcrumb />
      <div>
        <div className="mb-2 text-2xl font-bold capitalize">edit product</div>
        <p className="text-sm text-gray-500">perbarui detail produk.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* product info card */}
        <AdminCard title="product information">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">

              {/* category */}
              <div>
                <label className="text-sm font-medium">kategori</label>
                <div className="mt-1 flex items-center gap-2">
                  <select
                    value={form.category_id}
                    onChange={handleCategoryChange}
                    className="w-full rounded-lg border border-gray-200 p-2"
                    required
                  >
                    <option value="">pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
                    onClick={() => setShowAddCategory(true)}
                    type="button"
                  >
                    + buat
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManageCategories(true)}
                  className="mt-1 text-xs underline"
                >
                  kelola kategori
                </button>
              </div>

              {/* name / slug */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">slug</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleSlugChange}
                    onBlur={handleSlugBlur}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                    required
                  />
                  {slugError && <p className="mt-1 text-sm text-red-600">{slugError}</p>}
                </div>
              </div>

              {/* description */}
              <div>
                <label className="block text-sm font-medium">description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                  required
                />
              </div>

              {/* price + toggles */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">price</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                    required
                  />
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <label className="inline-flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleToggleChange}
                    />
                    aktif
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleToggleChange}
                    />
                    tampilkan
                  </label>
                </div>
              </div>
            </div>
          )}
        </AdminCard>

        {/* images card */}
        <AdminCard title="media">
          {loading ? <Skeleton className="h-10 w-full" /> : <ImageUrlUploader value={images} onChange={setImages} />}
        </AdminCard>

        {/* variants */}
        <AdminCard title="variants">
          {loading ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            <div className="space-y-4">
              {variants.length === 0 ? (
                <p className="text-sm text-gray-500">belum ada varian. tambahkan varian bila diperlukan.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-[0.3em] text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">size</th>
                        <th className="px-4 py-3 text-left">color</th>
                        <th className="px-4 py-3 text-left">stock</th>
                        <th className="px-4 py-3 text-right">aksi</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {variants.map((v) => (
                        <tr key={v.id}>
                          <td className="px-4 py-3">
                            <input
                              value={v.size}
                              onChange={(e) => handleVariantChange(v.id, 'size', e.target.value)}
                              className="w-full rounded-lg border border-gray-200 p-2"
                              placeholder="contoh: xl"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              value={v.color}
                              onChange={(e) => handleVariantChange(v.id, 'color', e.target.value)}
                              className="w-full rounded-lg border border-gray-200 p-2"
                              placeholder="contoh: black"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)}
                              className="w-full rounded-lg border border-gray-200 p-2"
                              placeholder="0"
                            />
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeVariant(v.id)}
                              className="text-sm text-red-600"
                            >
                              hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                onClick={addVariant}
                className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm uppercase tracking-[0.3em] text-gray-500 hover:border-gray-500"
              >
                + tambah variant
              </button>
            </div>
          )}
        </AdminCard>

        <Button type="submit" className={saving ? 'opacity-60 pointer-events-none' : ''}>
          {saving ? 'saving...' : 'save changes'}
        </Button>
      </form>

      <Toast message={toast} />

      {/* modals */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onCreated={(cat) => {
            setCategories((prev) => [...prev, cat]);
            setForm((prev) => ({ ...prev, category_id: String(cat.id) }));
          }}
        />
      )}

      {showManageCategories && (
        <ManageCategoriesModal
          categories={categories}
          onClose={() => setShowManageCategories(false)}
          onDeleted={(deletedId) => {
            setCategories((prev) => prev.filter((c) => String(c.id) !== String(deletedId)));
            setForm((prev) =>
              String(prev.category_id) === String(deletedId) ? { ...prev, category_id: '' } : prev
            );
          }}
        />
      )}
    </div>
  );
}
