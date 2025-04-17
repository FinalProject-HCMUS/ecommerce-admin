import axios from 'axios';
import { Product, Color, Size, ProductColorSize, ProductImage } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data.data;
};

export const getColors = async (): Promise<Color[]> => {
  const response = await axios.get<{ colors: Color[] }>(API_URL);
  return response.data.colors;
};

export const getSizes = async (): Promise<Size[]> => {
  const response = await axios.get<{ sizes: Size[] }>(API_URL);
  return response.data.sizes;
};

export const getProductColorSizes = async (): Promise<ProductColorSize[]> => {
  const response = await axios.get<{ productColorSizes: ProductColorSize[] }>(API_URL);
  return response.data.productColorSizes;
};

export const getProductImages = async (): Promise<ProductImage[]> => {
  const response = await axios.get<{ productImages: ProductImage[] }>(API_URL);
  return response.data.productImages;
};

export const getProductImagesByProductId = async (productId: string): Promise<ProductImage[]> => {
  const response = await axios.get<{ productImages: ProductImage[] }>(API_URL);
  return response.data.productImages.filter(image => image.product_id === productId);
};