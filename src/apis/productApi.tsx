import axios from 'axios';
import { Product, Color, Size, ProductColorSize, ProductImage } from '../types';

const API_URL = './data.json'; // Update this path to the correct location of your data.json file

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<{ products: Product[] }>(API_URL);
  return response.data.products;
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