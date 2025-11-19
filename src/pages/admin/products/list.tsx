import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct } from '@/services/products';
import Breadcrumb from '@/components/admin/Breadcrumb';
import AdminCard from '@/components/admin/AdminCard';
import Button from '@/components/admin/Button';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Skeleton from '@/components/admin/Skeleton';
import { Toast, useToast } from '@/components/admin/Toast';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function ProductsList() {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast, show } = useToast();
  const { data: products, loading, error, refetch } = useProducts({ includeInactive: true });
  const {
    data: categories,
    error: categoriesError,
    loading: categoriesLoading,
  } = useCategories();

  useEffect(() => {
    if (error) {
      show('gagal memuat produk');
      console.error('Failed to load products:', error);
    }
  }, [error, show]);

  useEffect(() => {
    if (categoriesError) {
      show('gagal memuat kategori');
      console.error('Failed to load categories:', categoriesError);
    }
  }, [categoriesError, show]);

  const filteredProducts = useMemo(() => {
    const categoryNameMap = new Map<string, string>();
    categories.forEach((category) => {
      categoryNameMap.set(String(category.id), category.name);
    });
    const collator = new Intl.Collator('id', { sensitivity: 'base' });
    const resolveCategoryName = (product: (typeof products)[number]) => {
      if (product.category?.name) {
        return product.category.name;
      }
      if (product.category_id) {
        return categoryNameMap.get(product.category_id) ?? '';
      }
      return '';
    };
    return products
      .filter((product) => selectedCategory === 'all' || product.category_id === selectedCategory)
      .slice()
      .sort((a, b) => {
        const compareCategory = collator.compare(resolveCategoryName(a), resolveCategoryName(b));
        if (compareCategory !== 0) {
          return compareCategory;
        }
        return collator.compare(a.name, b.name);
      });
  }, [products, categories, selectedCategory]);

  const handleDelete = async () => {
    if (!targetId) return;
    const { error } = await deleteProduct(targetId);
    if (error) {
      console.error('Failed to delete product:', error);
      show('gagal menghapus produk');
      return;
    }
    setTargetId(null);
    show('produk dihapus');
    await refetch();
  };

  return (
    <div className="space-y-8">
      <Breadcrumb />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-2xl font-bold capitalize">products</div>
          <p className="text-sm text-gray-500">kelola seluruh produk katalog zexalva.</p>
        </div>
        <Link to="/admin/products/create">
          <Button>+ add new</Button>
        </Link>
      </div>
      <AdminCard>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
              <select
                className="border border-gray-200 px-3 py-2 text-sm rounded-md shadow-sm"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                disabled={categoriesLoading}
              >
                <option value="all">semua kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <table className="min-w-full bg-[var(--admin-card-bg)] rounded-xl shadow border border-gray-200 text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-[0.3em] text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.category?.name ?? product.category_id ?? 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 text-gray-800">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-gray-800">{product.stock ?? 0}</td>
                    <td className="px-4 py-3">
                      {product.featured ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Yes</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <Link to={`/admin/products/edit/${product.id}`} className="text-blue-600 text-sm">
                          edit
                        </Link>
                        <button type="button" onClick={() => setTargetId(product.id)} className="text-red-600 text-sm">
                          delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
      <Toast message={toast} />
      <ConfirmModal open={Boolean(targetId)} onConfirm={handleDelete} onCancel={() => setTargetId(null)} />
    </div>
  );
}
