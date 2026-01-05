
import React from 'react';
import { Product } from '../types.ts';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative bg-[#222222] w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-[#fcc624] text-black rounded-full h-8 w-8 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <span className="material-icons-round text-xl font-black">close</span>
        </button>
        
        <div className="p-5">
          <div className="aspect-[1.5/1] rounded-[2rem] overflow-hidden shadow-2xl mb-8">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6 px-4 pb-4 text-white">
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-[#fcc624] text-2xl">restaurant</span>
              <h2 className="text-xl font-bold tracking-tight">
                {product.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-[#fcc624] text-2xl">info</span>
              <p className="text-gray-200 font-semibold">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-[#fcc624] text-2xl">point_of_sale</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold">
                {product.prices.map((price, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-white whitespace-nowrap">{price.size}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#fcc624] whitespace-nowrap">{price.price_value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
