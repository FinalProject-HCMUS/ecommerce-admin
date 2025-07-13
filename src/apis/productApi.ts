/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomResponse } from '../types/common/CustomResponse';
import { ProductResponse } from '../types/product/ProductResponse';
import { Product } from '../types/product/Product';
import { ProductImage } from '../types/product/ProductImage';
import { ProductRequest } from '../types/product/ProductRequest';
import { ProductColorSizeRequest } from '../types/product/ProductColorSizeRequest';
import { ProductColorSize } from '../types/product/ProductColorSize';
import { ProductColorSizeResponse } from '../types/product/ProductColorSizeResponse';
import apiClient from './axiosConfig';

export const getProducts = async (page: number, perpage: number, sort: string = "createdAt,asc", category: string = "", keysearch: string = "", size: string = "", color: string = "", fromprice: number = 0, toprice: number = 30000000): Promise<CustomResponse<ProductResponse>> => {
  try {
    const response = await apiClient.get<CustomResponse<ProductResponse>>(`/products`, {
      params: { page, perpage, sort, category, keysearch, size, color, fromprice, toprice }
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
};

export const getProductById = async (id: string): Promise<CustomResponse<Product>> => {
  try {
    const response = await apiClient.get<CustomResponse<Product>>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const addProduct = async (productData: ProductRequest): Promise<CustomResponse<Product>> => {
  try {
    const response = await apiClient.post<CustomResponse<Product>>(`/products`, productData);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const updateProduct = async (id: string, productData: Product): Promise<CustomResponse<Product>> => {
  try {
    const response = await apiClient.put<CustomResponse<Product>>(`/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const getProductImages = async (id: string): Promise<CustomResponse<ProductImage[]>> => {
  try {
    const response = await apiClient.get<CustomResponse<ProductImage[]>>(`/product-images/product/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
};

export const updateProductImages = async (images: ProductImage[]): Promise<CustomResponse<ProductImage>> => {
  try {
    const response = await apiClient.put<CustomResponse<ProductImage>>(`/product-images/update-list`, images);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const deleteProduct = async (id: string): Promise<CustomResponse<Product>> => {
  try {
    const response = await apiClient.delete<CustomResponse<Product>>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const uploadProductImages = async (files: File[]): Promise<CustomResponse<string[]>> => {
  try {
    const response = await apiClient.post<CustomResponse<string[]>>(`/product-images/upload`, files, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const createProductColorSizes = async (productColorSizes: ProductColorSizeRequest[]): Promise<CustomResponse<ProductColorSize>> => {
  try {
    const response = await apiClient.post<CustomResponse<ProductColorSize>>(`/product-color-sizes/batch`, { productColorSizes });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const getProductColorSizes = async (id: string): Promise<CustomResponse<ProductColorSize[]>> => {
  try {
    const response = await apiClient.get<CustomResponse<ProductColorSize[]>>(`/product-color-sizes/product/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const getProductColorSizesByProductId = async (id: string, page: number, size: number): Promise<CustomResponse<ProductColorSizeResponse>> => {
  try {
    const response = await apiClient.get<CustomResponse<ProductColorSizeResponse>>(`/product-color-sizes/product/${id}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const deleteProductImage = async (id: string): Promise<CustomResponse<ProductImage>> => {
  try {
    const response = await apiClient.delete<CustomResponse<ProductImage>>(`/product-images/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}

export const updateProductColorSize = async (id: string, productColorSize: ProductColorSizeRequest): Promise<CustomResponse<ProductColorSize>> => {
  try {
    const response = await apiClient.put<CustomResponse<ProductColorSize>>(`/product-color-sizes/${id}`, productColorSize);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { isSuccess: false, message: 'Network error' };
  }
}