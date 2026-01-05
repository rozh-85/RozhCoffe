
import React, { useEffect, useRef, useState } from 'react';
import { Category } from '../types.ts';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function CategorySelector({ categories, selectedCategoryId, onSelectCategory }: CategorySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const activeElement = containerRef.current?.querySelector(`[data-id="${selectedCategoryId}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedCategoryId]);

  const handleImageError = (catId: string) => {
    setImageErrors(prev => new Set(prev).add(catId));
  };

  return (
    <section className="bg-surface-light dark:bg-zinc-900 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-3 pb-1 pt-1 px-1 scrollbar-hide no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            data-id={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-none flex items-center gap-3 p-1.5 pr-4 cursor-pointer rounded-xl transition-all duration-300 group min-w-[140px] ${selectedCategoryId === cat.id
              ? 'bg-primary text-zinc-900 shadow-lg shadow-primary/20'
              : 'hover:bg-gray-100 dark:hover:bg-zinc-800 bg-gray-50 dark:bg-zinc-900/60'
              }`}
          >
            <div className="relative flex-none w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700/50">
              <span className={`material-icons-round text-lg absolute ${selectedCategoryId === cat.id ? 'text-zinc-600' : 'text-zinc-700'}`}>
                restaurant_menu
              </span>
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className={`w-full h-full object-cover relative z-10 transition-transform duration-500 ${selectedCategoryId === cat.id ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className={`font-black text-xs transition-colors truncate tracking-tight ${selectedCategoryId === cat.id ? 'text-zinc-900' : 'text-gray-900 dark:text-white'
                }`}>
                {cat.name}
              </span>
              <span className={`text-[10px] font-bold opacity-70 ${selectedCategoryId === cat.id ? 'text-zinc-800' : 'text-primary'
                }`}>
                {cat.itemCount} Items
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
