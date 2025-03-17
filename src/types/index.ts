export interface Category {
  id: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  cost: number;
  total: number;
  price: number;
  discount_percent: number;
  enable: boolean;
  in_stock: boolean;
  main_image_url: string;
  average_rating: number;
  review_count: number;
  created_time: string;
  update_time: string;
  images: string[];
}

export interface Color {
  id: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
  minHeight: number;
  maxHeight: number;
  minWeight: number;
  maxWeight: number;
}

export interface ProductColorSize {
  id: string;
  product_id: string;
  color_id: string;
  size_id: string;
  quantity: number;
}

export interface ProductImage {
  id: string;
  url: string;
  product_id: string;
}

export interface Login {
  username: string;
  password: string;
};
