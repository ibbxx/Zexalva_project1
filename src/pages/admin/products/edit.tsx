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
import { updateProduct } from '@/services/products';
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

  useEffect(() => {
    let isMounted = true;
    getCategories().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }
      if (error) {
        console.error('Failed to load categories:', error);
        show('gagal memuat kategori');
        return;
      }
      setCategories(data ?? []);
    });
    return () => {
      isMounted = false;
    };
  }, [show]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(
            `
            id,
            name,
            slug,
            description,
            price,
            is_active,
            is_published,
            category_id,
            product_images (id, url, position),
            product_variants (id, size, color, stock)
          `
          )
          .eq('id', id)
          .single();
        if (error) {
          throw error;
        }
        if (data) {
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
          const sortedImages = (data.product_images ?? [])
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((img) => ({ url: img.url ?? '' }));
          setImages(sortedImages);
          const nextVariants = (data.product_variants ?? []).map((variant) => ({
            id: variant.id ? String(variant.id) : createEmptyVariant().id,
            size: variant.size ?? '',
            color: variant.color ?? '',
            stock: variant.stock !== undefined && variant.stock !== null ? String(variant.stock) : '',
          }));
          setVariants(nextVariants.length ? nextVariants : [createEmptyVariant()]);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        show('gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };
    loadProduct().catch(() => setLoading(false));
  }, [id, show]);

  useEffect(() => {
    if (!isSlugSynced) {
      return;
    }
    setForm((prev) => {
      const generated = generateSlug(prev.name);
      if (prev.slug === generated) {
        return prev;
      }
      return {
        ...prev,
        slug: generated,
      };
    });
  }, [form.name, isSlugSynced]);

  type ValidateSlugOptions = {
    promptOnDuplicate?: boolean;
    resyncOnEmpty?: boolean;
  };

  const validateSlug = useCallback(
    async (value: string, options: ValidateSlugOptions = {}): Promise<string | null> => {
      const { promptOnDuplicate = false, resyncOnEmpty = false } = options;
      const trimmed = value.trim();
      const normalizedOriginal = originalSlug.trim();
      if (!trimmed) {
        const base = generateSlug(form.name);
        if (!base) {
          if (resyncOnEmpty) {
            setIsSlugSynced(true);
          }
          setSlugError('');
          return '';
        }
        try {
          const unique = await ensureUniqueSlug(base);
          setForm((prev) => ({
            ...prev,
            slug: unique,
          }));
          if (resyncOnEmpty) {
            setIsSlugSynced(true);
          }
          setSlugError('');
          return unique;
        } catch (error) {
          console.error('Failed to ensure unique slug:', error);
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
            const shouldAuto = window.confirm('slug telah dipakai. ingin generate otomatis slug unik?');
            if (shouldAuto) {
              try {
                const unique = await ensureUniqueSlug(trimmed);
                setForm((prev) => ({
                  ...prev,
                  slug: unique,
                }));
                setSlugError('');
                return unique;
              } catch (error) {
                console.error('Failed to ensure unique slug:', error);
                show('gagal memvalidasi slug');
                return null;
              }
            }
          }
          return null;
        }
        setSlugError('');
        return trimmed;
      } catch (error) {
        console.error('Failed to validate slug:', error);
        show('gagal memvalidasi slug');
        return null;
      }
    },
    [form.name, originalSlug, show]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSlugSynced(false);
    const sanitized = slugify(event.target.value);
    setSlugError('');
    setForm((prev) => ({
      ...prev,
      slug: sanitized,
    }));
  };

  const handleSlugBlur = () => {
    void validateSlug(form.slug, { promptOnDuplicate: true, resyncOnEmpty: true });
  };

  const handleVariantChange = (variantId: string, field: keyof Omit<VariantFormValue, 'id'>, value: string) => {
    setVariants((prev) =>
      prev.map((variant) => (variant.id === variantId ? { ...variant, [field]: value } : variant))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()]);
  };

  const removeVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== variantId));
  };

  const imageUrls = useMemo(
    () => images.filter((img) => /^https?:\/\//i.test(img.url)).map((img) => img.url),
    [images]
  );

  const variantPayload = useMemo(
    () =>
      variants
        .map((variant) => ({
          size: variant.size.trim() || null,
          color: variant.color.trim() || null,
          stock: variant.stock !== '' ? Number(variant.stock) : null,
          price: null,
        }))
        .filter((variant) => variant.size),
    [variants]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    if (!form.category_id) {
      show('pilih kategori terlebih dahulu');
      return;
    }
    const finalSlug = await validateSlug(form.slug, { promptOnDuplicate: true, resyncOnEmpty: true });
    if (!finalSlug) {
      return;
    }
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
      if (error) {
        throw error;
      }
      show('produk diperbarui');
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      show('gagal memperbarui produk');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb />
      <div>
        <div className="mb-2 text-2xl font-bold capitalize">edit product</div>
        <p className="text-sm text-gray-500">perbarui detail produk.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard title="product information">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
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
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
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
              <div>
                <label className="block text-sm font-medium">description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                  rows={5}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">price</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                    min={0}
                    step={1000}
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

        <AdminCard title="media">
          {loading ? <Skeleton className="h-10 w-full" /> : <ImageUrlUploader value={images} onChange={setImages} />}
        </AdminCard>

        <AdminCard title="variants">
          {loading ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            <div className="space-y-4">
              {variants.length === 0 && (
                <p className="text-sm text-gray-500">Belum ada varian. Tambahkan minimal satu ukuran.</p>
              )}
              {variants.map((variant, index) => (
                <div key={variant.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                      Variant {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() => removeVariant(variant.id)}
                    >
                      hapus
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium">size *</label>
                      <input
                        value={variant.size}
                        onChange={(event) => handleVariantChange(variant.id, 'size', event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">color</label>
                      <input
                        value={variant.color}
                        onChange={(event) => handleVariantChange(variant.id, 'color', event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(event) => handleVariantChange(variant.id, 'stock', event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onCreated={(category) => {
            setCategories((prev) => [...prev, category]);
            setForm((prev) => ({
              ...prev,
              category_id: String(category.id),
            }));
          }}
        />
      )}
      {showManageCategories && (
        <ManageCategoriesModal
          categories={categories}
          onClose={() => setShowManageCategories(false)}
          onDeleted={(deletedId) => {
            setCategories((prev) => prev.filter((cat) => String(cat.id) !== String(deletedId)));
            setForm((prev) => (String(prev.category_id) === String(deletedId) ? { ...prev, category_id: '' } : prev));
          }}
        />
      )}
    </div>
  );
}
