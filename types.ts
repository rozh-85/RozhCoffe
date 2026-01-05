
export interface PriceOption {
  size: string;
  price_value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  is_available: boolean;
  prices: PriceOption[];
  isMultiPriced?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  itemCount?: number;
}

export interface MenuCategory { 
  id: string; 
  name: string; 
  image_url: string; 
  products: Product[]; 
}
