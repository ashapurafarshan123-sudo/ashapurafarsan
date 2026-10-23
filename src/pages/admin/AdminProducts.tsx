import React, { useEffect, useState } from 'react';
import { productService, AdminProductPayload } from '../../services/productService';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { useCart } from '../../context/CartContext';
import {
  Plus,
  Search,
  Edit2,
  X,
  Upload,
  AlertCircle,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { formatPrice } = useCart();
  const [products, setProducts] = useState<Array<Product & { isActive: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(Product & { isActive: boolean }) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<AdminProductPayload>({
    name: '',
    slug: '',
    categorySlug: 'namkeen',
    description: '',
    image: '/images/products/ratlami-sev.webp',
    bestseller: false,
    isActive: true,
    prices: {
      '250g': 90,
      '500g': 175,
      '1kg': 340,
    },
  });

  const loadProducts = async () => {
    try {
      const data = await productService.getAdminProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load admin products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      categorySlug: 'namkeen',
      description: '',
      image: '/images/products/ratlami-sev.webp',
      bestseller: false,
      isActive: true,
      prices: {
        '250g': 90,
        '500g': 175,
        '1kg': 340,
      },
    });
    setModalError('');
    setShowEditModal(true);
  };

  const handleOpenEdit = (p: Product & { isActive: boolean }) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      name: p.name,
      slug: p.slug,
      categorySlug: p.categorySlug,
      description: p.description,
      image: p.image,
      bestseller: p.bestseller,
      isActive: p.isActive,
      prices: { ...p.prices },
    });
    setModalError('');
    setShowEditModal(true);
  };

  const handleToggleActive = async (p: Product & { isActive: boolean }) => {
    const success = await productService.toggleProductActive(p.id, p.isActive);
    if (success) {
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: !item.isActive } : item))
      );
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setModalError('');
    const res = await productService.uploadProductImage(file);
    setUploadingImage(false);

    if (res.url) {
      setFormData((prev) => ({ ...prev, image: res.url! }));
    } else {
      setModalError(res.error || 'Image upload failed. You can paste an image path directly.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!formData.name.trim()) {
      setModalError('Product name is required.');
      return;
    }

    const slug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    setIsSaving(true);
    try {
      const payload: AdminProductPayload = {
        ...formData,
        slug,
        id: editingProduct?.id || `prod-${slug}`,
      };

      const res = await productService.saveProduct(payload);
      if (!res.success) {
        setModalError(res.error || 'Failed to save product in database.');
        setIsSaving(false);
        return;
      }

      setShowEditModal(false);
      await loadProducts();
    } catch {
      setModalError('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categorySlug.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.categorySlug === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-serif font-bold text-brown-900 text-xl">Product Catalog & Prices</h2>
          <p className="text-xs text-brown-500 mt-0.5">
            Manage snacks, package weight pricing (250g, 500g, 1kg) and product availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full h-9 pl-8 pr-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 px-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-xs text-brown-500">
          No products found matching your search.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-brown-800 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">250g Price</th>
                <th className="py-2.5 px-3">500g Price</th>
                <th className="py-2.5 px-3">1kg Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50/60">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-md border border-line bg-cream-100 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/categories/food-snacks.png';
                        }}
                      />
                      <div>
                        <div className="font-bold text-brown-900 flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.bestseller && (
                            <span className="px-1.5 py-0.2 rounded bg-peach-100 text-orange-700 text-[9px] font-bold border border-orange-200">
                              Bestseller
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-brown-400 font-mono">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 capitalize text-brown-700">{p.categorySlug}</td>
                  <td className="py-3 px-3 font-semibold text-brown-900">
                    {formatPrice(p.prices['250g'] || 0)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-brown-900">
                    {formatPrice(p.prices['500g'] || 0)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-brown-900">
                    {formatPrice(p.prices['1kg'] || 0)}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        p.isActive
                          ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                          : 'bg-cream-200 text-brown-500 border-line hover:bg-cream-300'
                      }`}
                      title="Click to toggle product availability"
                    >
                      {p.isActive ? 'Active' : 'Archived'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="px-2.5 py-1 bg-cream-100 hover:bg-peach-100 text-brown-900 text-[11px] font-semibold rounded border border-line inline-flex items-center gap-1 transition-colors"
                    >
                      <Edit2 size={11} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-brown-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-card border border-line p-6 max-w-xl w-full shadow-2xl my-8 space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="font-serif font-bold text-brown-900 text-lg">
                {editingProduct ? 'Edit Product & Pricing' : 'Add New Snack to Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-brown-400 hover:text-brown-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Product Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brown-900 mb-1">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Special Bhavnagri Gathiya"
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brown-900 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. special-bhavnagri-gathiya"
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Category & Bestseller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brown-900 mb-1">Category</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) =>
                        setFormData({ ...formData, bestseller: e.target.checked })
                      }
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-semibold text-brown-900">Mark as Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-semibold text-brown-900">Active / Orderable</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-brown-900 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Artisanal recipe details, spices, crispness..."
                  className="w-full p-2.5 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Pricing Grid */}
              <div className="p-3 bg-cream-50 rounded-lg border border-line">
                <p className="font-semibold text-brown-900 mb-2">Package Weight Pricing (₹ INR)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-brown-600 mb-1">250g Price</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.prices['250g']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '250g': Number(e.target.value) },
                        })
                      }
                      className="w-full h-8 px-2.5 bg-white border border-line rounded focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-brown-600 mb-1">500g Price</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.prices['500g']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '500g': Number(e.target.value) },
                        })
                      }
                      className="w-full h-8 px-2.5 bg-white border border-line rounded focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-brown-600 mb-1">1kg Price</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.prices['1kg']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '1kg': Number(e.target.value) },
                        })
                      }
                      className="w-full h-8 px-2.5 bg-white border border-line rounded focus:outline-none focus:border-orange-600"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block font-semibold text-brown-900 mb-1">Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/products/..."
                    className="flex-1 h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-cream-100 hover:bg-peach-100 text-brown-900 rounded-lg border border-line cursor-pointer flex items-center gap-1.5 shrink-0 font-semibold text-[11px]">
                    <Upload size={13} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-peach-100 text-brown-900 font-semibold rounded-full border border-line"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingImage}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold rounded-full shadow-cta flex items-center gap-2"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Save Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProducts;
