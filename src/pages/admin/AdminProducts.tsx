import React, { useEffect, useState } from 'react';
import { productService, AdminProductPayload } from '../../services/productService';
import { Product } from '../../types';
import { CATEGORIES, ALL_CATEGORIES } from '../../data/categories';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  PackageCheck,
  PackageX,
  RefreshCw,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Array<Product & { isActive: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>('name_asc');

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(Product & { isActive: boolean }) | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<(Product & { isActive: boolean }) | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      '750g': 0,
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

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

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
        '750g': 0,
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
      prices: {
        '250g': p.prices['250g'] || 0,
        '500g': p.prices['500g'] || 0,
        '750g': p.prices['750g'] || 0,
        '1kg': p.prices['1kg'] || 0,
      },
    });
    setModalError('');
    setShowEditModal(true);
  };

  const handleToggleStock = async (p: Product & { isActive: boolean }) => {
    const nextStatus = !p.isActive;
    const success = await productService.toggleProductActive(p.id, p.isActive);
    if (success) {
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: nextStatus } : item))
      );
      showToast('success', `${p.name} is now marked ${nextStatus ? 'In Stock' : 'Out of Stock'}.`);
      await loadProducts();
    } else {
      showToast('error', `Failed to update stock status in database for ${p.name}.`);
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

    if (!formData.prices['250g'] || formData.prices['250g'] <= 0) {
      setModalError('Price for 250g must be greater than zero.');
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

      if (res.product) {
        const savedProd = res.product;
        setProducts((prev) =>
          prev.map((item) => (item.id === savedProd.id ? savedProd : item))
        );
      }

      setShowEditModal(false);
      showToast('success', `Product "${formData.name}" saved successfully and verified in database!`);
      await loadProducts();
    } catch (err: unknown) {
      setModalError((err as Error)?.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (p: Product & { isActive: boolean }) => {
    setProductToDelete(p);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await productService.deleteProduct(productToDelete.id);
      if (res.success) {
        setShowDeleteModal(false);
        showToast('success', res.message || 'Product removed successfully.');
        await loadProducts();
      } else {
        showToast('error', res.error || 'Failed to delete product.');
      }
    } catch {
      showToast('error', 'An error occurred while deleting product.');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === 'all' || p.categorySlug === categoryFilter;
      const matchStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && p.isActive) ||
        (stockFilter === 'out_of_stock' && !p.isActive);

      return matchSearch && matchCategory && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price_asc') return a.prices['250g'] - b.prices['250g'];
      if (sortBy === 'price_desc') return b.prices['250g'] - a.prices['250g'];
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs flex items-center gap-2.5 max-w-md animate-in slide-in-from-bottom-3 duration-200 ${
            toastMsg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {toastMsg.type === 'success' ? <CheckCircle size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-600" />}
          <span className="font-medium">{toastMsg.text}</span>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
            Product & Inventory Management
          </h2>
          <p className="text-xs text-brown-500 mt-0.5">
            Manage Farsan catalog, variant pricing (250g, 500g, 750g, 1kg), stock status, and product images.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadProducts}
            className="p-2.5 bg-cream-100 hover:bg-peach-100 text-brown-800 rounded-lg border border-line transition-colors"
            title="Reload products"
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-cta transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white border border-line rounded-card p-4 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brown-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farsan by name or slug..."
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
        >
          <option value="all">All Categories ({products.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.title}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as any)}
          className="px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
        >
          <option value="all">Stock Status: All Products</option>
          <option value="in_stock">In Stock Only</option>
          <option value="out_of_stock">Out of Stock Only</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
        >
          <option value="name_asc">Sort: Name (A to Z)</option>
          <option value="name_desc">Sort: Name (Z to A)</option>
          <option value="price_asc">Sort: Price (Low to High)</option>
          <option value="price_desc">Sort: Price (High to Low)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-line rounded-card shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brown-500">
            <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
            <span>Loading product inventory from Supabase...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-brown-500 text-xs">
            No products match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-line text-brown-600 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">250g</th>
                  <th className="py-3 px-3">500g</th>
                  <th className="py-3 px-3">1kg</th>
                  <th className="py-3 px-3">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/70 transition-colors">
                    {/* Product Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover border border-line bg-cream-50 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/products/ratlami-sev.webp';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-brown-900">{p.name}</span>
                            {p.bestseller && (
                              <span className="px-1.5 py-0.2 bg-peach-100 text-orange-700 text-[9px] font-bold rounded">
                                Bestseller
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-brown-400 font-mono">
                            {p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-cream-100 text-brown-800 border border-line">
                        {p.categorySlug}
                      </span>
                    </td>

                    {/* Prices */}
                    <td className="py-3 px-3 font-semibold text-brown-800">
                      ₹{p.prices['250g'] || 0}
                    </td>
                    <td className="py-3 px-3 font-semibold text-brown-800">
                      ₹{p.prices['500g'] || 0}
                    </td>
                    <td className="py-3 px-3 font-semibold text-brown-800">
                      ₹{p.prices['1kg'] || 0}
                    </td>

                    {/* Stock Status Switch Button */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                          p.isActive
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                            : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                        }`}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        {p.isActive ? (
                          <>
                            <PackageCheck size={12} className="text-green-700" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <PackageX size={12} className="text-stone-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-brown-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(p)}
                          className="p-1.5 text-brown-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-line rounded-card max-w-xl w-full p-6 shadow-card my-8 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="font-serif font-bold text-brown-900 text-base">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Farsan Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 text-brown-400 hover:text-brown-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brown-800 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Special Ratlami Sev"
                    required
                    className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brown-800 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated from name"
                    className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category & Bestseller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-brown-800 mb-1">Category *</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="rounded border-line text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="font-semibold text-brown-800">Mark as Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-line text-green-600 focus:ring-green-500 w-4 h-4"
                    />
                    <span className="font-semibold text-brown-800">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-brown-800 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Traditional taste description, ingredients or crispiness..."
                  className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Image Upload & URL */}
              <div>
                <label className="block font-bold text-brown-800 mb-1">Product Image</label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-line bg-cream-50 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/ratlami-sev.webp';
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Storage URL or path e.g. /images/products/..."
                      className="w-full px-3 py-1.5 bg-cream-50/50 border border-line rounded-lg text-brown-900 text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-100 hover:bg-peach-100 text-brown-800 text-[11px] font-semibold rounded cursor-pointer border border-line transition-colors">
                        <Upload size={13} />
                        <span>{uploadingImage ? 'Uploading to Supabase...' : 'Upload New File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-brown-400">
                        Uploads directly to Supabase Storage bucket 'product-images'
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variant Prices (250g, 500g, 750g, 1kg) */}
              <div className="border-t border-line pt-3">
                <label className="block font-bold text-brown-800 mb-2 uppercase tracking-wider text-[11px]">
                  Packaging Variant Prices (₹ INR)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-brown-600 mb-1 font-semibold text-[11px]">250 g *</label>
                    <input
                      type="number"
                      value={formData.prices['250g']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '250g': Number(e.target.value) },
                        })
                      }
                      min="0"
                      required
                      className="w-full px-3 py-1.5 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-brown-600 mb-1 font-semibold text-[11px]">500 g</label>
                    <input
                      type="number"
                      value={formData.prices['500g']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '500g': Number(e.target.value) },
                        })
                      }
                      min="0"
                      className="w-full px-3 py-1.5 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-brown-600 mb-1 font-semibold text-[11px]">750 g (Opt)</label>
                    <input
                      type="number"
                      value={formData.prices['750g'] || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '750g': Number(e.target.value) },
                        })
                      }
                      min="0"
                      className="w-full px-3 py-1.5 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-brown-600 mb-1 font-semibold text-[11px]">1 kg</label>
                    <input
                      type="number"
                      value={formData.prices['1kg']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prices: { ...formData.prices, '1kg': Number(e.target.value) },
                        })
                      }
                      min="0"
                      className="w-full px-3 py-1.5 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-brown-800 font-semibold rounded-lg border border-line transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving to Supabase...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm">
          <div className="bg-white border border-line rounded-card max-w-md w-full p-6 shadow-card space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-brown-900 text-base">Delete Product?</h3>
                <p className="text-xs text-brown-500">Safe Deletion & Archival Guard</p>
              </div>
            </div>

            <p className="text-xs text-brown-700 leading-relaxed">
              Are you sure you want to delete <strong className="text-brown-900">{productToDelete.name}</strong>?
            </p>
            <p className="text-[11px] text-brown-500 bg-cream-50 p-3 rounded-lg border border-line">
              <strong>Notice:</strong> If this product is referenced in existing customer orders, it will be safely <strong>archived and marked Out of Stock</strong> instead of destroyed, ensuring your historical order records and tax totals remain completely intact.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-brown-800 font-semibold rounded-lg border border-line text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-cta text-xs transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
