import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductGrid } from '../components/ProductGrid';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';
import { Search, X, RotateCcw } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentQuery = searchParams.get('q') || '';

  // Filter products based on category and query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = currentCategory
        ? product.categorySlug === currentCategory
        : true;
      const matchesQuery = currentQuery
        ? product.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(currentQuery.toLowerCase())
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [currentCategory, currentQuery]);

  const handleCategorySelect = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === currentCategory) {
      nextParams.delete('category');
    } else {
      nextParams.set('category', slug);
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === currentCategory);

  return (
    <>
      <SEO
        title={
          activeCategoryObj
            ? `${activeCategoryObj.title} - Ashapura Farsan`
            : currentQuery
            ? `Search: "${currentQuery}" - Ashapura Farsan`
            : 'All Farsan, Namkeen & Wafers - Ashapura Farsan'
        }
        description="Browse our complete catalog of traditional Gujarati farsan, gathiya, sev, chakli, chivda, and wafers. Order online on WhatsApp directly from our Mira Road shop."
      />

      <div className="bg-cream-50 min-h-screen py-8 sm:py-12">
        <div className="container-custom">
          {/* Page Heading */}
          <SectionHeading
            eyebrow="FRESH IN-HOUSE SPECIALS"
            titleRegular="Our Complete"
            titleItalic="Catalog"
            subtitle="Select your favourites, choose weights, and order directly on WhatsApp with shop delivery or store pickup."
          />

          {/* Search bar & Active filter indicators */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={currentQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  const nextParams = new URLSearchParams(searchParams);
                  if (val.trim()) {
                    nextParams.set('q', val);
                  } else {
                    nextParams.delete('q');
                  }
                  setSearchParams(nextParams);
                }}
                placeholder="Search products or ingredients..."
                className="w-full h-10 pl-9 pr-8 text-xs text-brown-900 bg-white border border-line rounded-full focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-500"
              />
              {currentQuery && (
                <button
                  type="button"
                  onClick={() => {
                    const nextParams = new URLSearchParams(searchParams);
                    nextParams.delete('q');
                    setSearchParams(nextParams);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-500 hover:text-brown-900"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Result count & Clear button */}
            <div className="flex items-center gap-3 text-xs text-brown-700">
              <span>
                Showing <strong>{filteredProducts.length}</strong> items
              </span>
              {(currentCategory || currentQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-orange-600 hover:underline font-semibold"
                >
                  <RotateCcw size={12} />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Chips: Horizontally scrollable on mobile */}
          <div className="mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 pb-2 min-w-max">
              <button
                type="button"
                onClick={() => {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete('category');
                  setSearchParams(nextParams);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  !currentCategory
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-brown-900 border-line hover:border-orange-500'
                }`}
              >
                All Categories ({PRODUCTS.length})
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = currentCategory === cat.slug;
                const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                        : 'bg-white text-brown-900 border-line hover:border-orange-500'
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-peach-100 text-brown-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid / Empty State */}
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="bg-white border border-line rounded-card p-10 text-center max-w-md mx-auto shadow-card my-8">
              <div className="w-16 h-16 rounded-full bg-peach-halo flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Search size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-semibold text-brown-900 text-lg mb-1">
                No snacks found
              </h3>
              <p className="text-xs text-brown-500 mb-6 max-w-xs mx-auto">
                We couldn&apos;t find any farsan matching your current search or category filter.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
              >
                Show All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Shop;
