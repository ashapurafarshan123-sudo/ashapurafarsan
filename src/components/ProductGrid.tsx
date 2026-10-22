import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  horizontalOnMobile?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  horizontalOnMobile = false,
}) => {
  if (horizontalOnMobile) {
    return (
      <div className="relative w-full">
        {/* Mobile Horizontal Snap Row / Desktop 4-col Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[80vw] sm:w-[260px] md:w-auto snap-center"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
