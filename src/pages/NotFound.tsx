import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <>
      <SEO
        title="Page Not Found - Ashapura Farsan"
        description="The page you requested could not be found. Explore our authentic Gujarati farsan, namkeen, and snacks."
      />

      <div className="bg-cream-50 min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white border border-line rounded-card p-8 text-center shadow-card space-y-5">
          <div className="w-16 h-16 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center mx-auto text-2xl font-serif font-bold">
            404
          </div>

          <h2 className="font-serif font-semibold text-brown-900 text-2xl">
            Page Not Found
          </h2>

          <p className="text-xs text-brown-500 leading-relaxed">
            The page you are looking for might have been moved, removed, or does not exist. Let&apos;s get you back to the fresh farsan menu.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/"
              className="h-10 px-5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta flex items-center justify-center gap-1.5 transition-colors"
            >
              <Home size={14} />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/shop"
              className="h-10 px-5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Browse Shop</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotFound;
