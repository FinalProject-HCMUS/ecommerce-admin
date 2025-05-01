import axios from 'axios';
import { CustomResponse } from '../types/common/CustomResponse';
import { Product } from '../types/product/Product';
import { ProductImage } from '../types/product/ProductImage';
import { ProductResponse } from '../types/product/ProductResponse';

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (page: number, perpage: number): Promise<ProductResponse> => {
  const response = await axios.get<CustomResponse<ProductResponse>>(`${API_URL}/products`,
    {
      params: {
        page, perpage
      },
    }
  );
  if (!response.data.isSuccess || !response.data.data) {
    throw new Error("Failed to fetch products");
  }
  return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<CustomResponse<Product>>(`${API_URL}/products/${id}`);
  if (!response.data.isSuccess || !response.data.data) {
    throw new Error("Failed to fetch product by ID");
  }
  return response.data.data;
}
export const updateProduct = async (id: string, productData: Product): Promise<Product> => {
  const response = await axios.put<CustomResponse<Product>>(`${API_URL}/products/${id}`, productData);
  if (!response.data.isSuccess || !response.data.data) {
    throw new Error("Failed to update product");
  }
  return response.data.data;
}
export const getProductImages = async (id: string): Promise<ProductImage[]> => {
  const response = await axios.get<CustomResponse<ProductImage[]>>(`${API_URL}/product-images/product/${id}`);
  if (!response.data.isSuccess || !response.data.data) {
    throw new Error("Failed to fetch product images");
  }
  return response.data.data;
};