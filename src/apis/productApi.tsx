/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { CustomResponse } from '../types/color/common/CustomResponse';
import { ProductResponse } from '../types/product/ProductResponse';
import { Product } from '../types/product/Product';
import { ProductImage } from '../types/product/ProductImage';
import { Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (page: number, perpage: number): Promise<CustomResponse<ProductResponse>> => {
  try {
    const response = await axios.get<CustomResponse<ProductResponse>>(`${API_URL}/products`, {
      params: {
        page, perpage
      },
    });
    return response.data
  }
  catch (error: any) {
    return error.response.data;
  }
};

export const getProductById = async (id: string): Promise<CustomResponse<Product>> => {
  try {
    const response = await axios.get<CustomResponse<Product>>(`${API_URL}/products/${id}`);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const addProduct = async (productData: Product): Promise<CustomResponse<Product>> => {
  try {
    const response = await axios.post<CustomResponse<Product>>(`${API_URL}/products`, productData);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const updateProduct = async (id: string, productData: Product): Promise<CustomResponse<Product>> => {
  try {
    const response = await axios.put<CustomResponse<Product>>(`${API_URL}/products/${id}`, productData);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const getProductImages = async (id: string): Promise<CustomResponse<ProductImage[]>> => {
  try {
    const response = await axios.get<CustomResponse<ProductImage[]>>(`${API_URL}/product-images/product/${id}`);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
};

export const updateProductImages = async (images: ProductImage[]): Promise<CustomResponse<ProductImage>> => {
  try {
    const response = await axios.put<CustomResponse<ProductImage>>(`${API_URL}/product-images/update-list`, images);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const deleteProduct = async (id: string): Promise<CustomResponse<Product>> => {
  try {
    const response = await axios.delete<CustomResponse<Product>>(`${API_URL}/products/${id}`);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}
export const uploadProductImages = async (files: File[]): Promise<CustomResponse<string[]>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post<CustomResponse<string[]>>(`${API_URL}/product-images/upload`, files, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}