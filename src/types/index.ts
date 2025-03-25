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

export interface User {
  id: string;
  email: string;
  phoneNum: string;
  firstName: string;
  lastName: string;
  address: string;
  weight: number;
  height: number;
  password: string;
  enabled: boolean;
  photo: string;
  role: 'USER' | 'ADMIN'; // Enum for roles
}

export type Status =
  | 'NEW'
  | 'CANCELLED'
  | 'PROCESSING'
  | 'PACKAGED'
  | 'PICKED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'REFUNDED';


export type PaymentMethod = 'COD' | 'VN_PAY' | 'MOMO';


export interface Order {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: Status;
  delivery_date: string;
  delivery_days: number;
  order_time: string;
  payment_method: PaymentMethod;
  shipping_cost: number;
  product_cost: number;
  sub_total: number;
  total: number;
  customer: User;
}

export interface OrderDetail {
  id: string;
  product_cost: number;
  quantity: number;
  unit_price: number;
  total: number;
  products: Product[];
  order_id: string;
}
