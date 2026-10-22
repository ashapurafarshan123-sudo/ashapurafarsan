import React, { useState } from 'react';
import { Product, ProductWeight } from '../types';
import { useCart } from '../context/CartContext';
import { SmartImage } from './SmartImage';
import { ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedWeight, setSelectedWeight] = useState<ProductWeight>('250g');
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, formatPrice } = useCart();

  const currentPrice = product.prices[selectedWeight];

  const handleAdd = () => {
    addToCart(product, selectedWeight);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const weights: { key: ProductWeight; label: string }[] = [
    { key: '250g', label: '250 g' },
    { key: '500g', label: '500 g' },
    { key: '1kg', label: '1 kg' },
  ];

  return (
    <div className="bg-white border border-line rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between h-full group">
      {/* Photo Area with Peach Halo Backdrop & Bestseller Tag */}
      <div className="relative w-full h-[140px] sm:h-[150px] bg-peach-halo/60 rounded-lg flex items-center justify-center overflow-hidden mb-3.5">
        {product.bestseller && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#FDE3C6] text-orange-600 text-[10px] font-bold rounded tracking-wide shadow-sm">
            Bestseller
          </span>
        )}

        <SmartImage
          src={product.image}
          alt={product.name}
          titleName={product.name}
          className="w-[100px] sm:w-[110px] h-[100px] sm:h-[110px] object-cover rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105"
          haloClassName="w-[100px] sm:w-[110px] h-[100px] sm:h-[110px]"
          loading="lazy"
          width={110}
          height={110}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="font-serif font-semibold text-brown-900 text-[15px] sm:text-[16px] leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-[11.5px] text-brown-500 leading-normal mt-1 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Weight Selector Chips */}
        <div className="flex items-center gap-1.5 mb-3.5" role="radiogroup" aria-label="Select weight">
          {weights.map((w) => {
            const isSelected = selectedWeight === w.key;
            return (
              <button
                key={w.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedWeight(w.key)}
                className={`flex-1 py-1 text-[10.5px] font-semibold rounded-full border transition-all text-center ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-brown-700 border-line hover:border-orange-500/50'
                }`}
              >
                {w.label}
              </button>
            );
          })}
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-line/60">
          <div className="flex flex-col">
            <span className="text-[10px] text-brown-500 font-medium">Price</span>
            <span className="text-[17px] font-semibold text-orange-600 font-sans leading-none">
              {formatPrice(currentPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`h-[34px] px-3.5 rounded-full text-[12px] font-medium font-sans flex items-center gap-1.5 transition-all shadow-sm ${
              isAdded
                ? 'bg-green-700 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white active:translate-y-[1px]'
            }`}
            aria-label={`Add ${product.name} (${selectedWeight}) to cart`}
          >
            {isAdded ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} strokeWidth={1.75} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
