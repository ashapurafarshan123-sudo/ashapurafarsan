import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  onSearchSubmitted?: () => void;
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  onSearchSubmitted,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
      if (onSearchSubmitted) onSearchSubmitted();
    } else {
      navigate('/shop');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center h-[40px] bg-white rounded-full border border-[#E9D8C2] focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-600/20 transition-all ${className}`}
      role="search"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search snacks, sev, namkeen..."
        className="w-full h-full pl-4 pr-11 text-[12px] text-brown-900 placeholder-brown-500 bg-transparent rounded-full focus:outline-none"
        aria-label="Search snacks, sev, namkeen"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-[3px] top-[3px] w-[34px] h-[34px] rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
      >
        <Search size={14} strokeWidth={2} />
      </button>
    </form>
  );
};
