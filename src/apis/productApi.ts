/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { CustomResponse } from '../types/common/CustomResponse';
import { ProductResponse } from '../types/product/ProductResponse';
import { Product } from '../types/product/Product';
import { ProductImage } from '../types/product/ProductImage';
import { ProductRequest } from '../types/product/ProductRequest';
import { ProductColorSizeRequest } from '../types/product/ProductColorSizeRequest';
import { ProductColorSize } from '../types/product/ProductColorSize';
import { ProductColorSizeResponse } from '../types/product/ProductColorSizeResponse';

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (page: number, perpage: number, sort: string = "createdAt,asc", category: string = "", keysearch: string = "", size: string = "", color: string = ""
  , fromprice: number = 0, toprice: number = 0
): Promise<CustomResponse<ProductResponse>> => {
  try {
    const response = await axios.get<CustomResponse<ProductResponse>>(`${API_URL}/products`, {
      params: {
        page, perpage, sort, category, keysearch, size, color, fromprice, toprice
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

export const addProduct = async (productData: ProductRequest): Promise<CustomResponse<Product>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post<CustomResponse<Product>>(`${API_URL}/products`, productData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const updateProduct = async (id: string, productData: Product): Promise<CustomResponse<Product>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.put<CustomResponse<Product>>(`${API_URL}/products/${id}`, productData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.put<CustomResponse<ProductImage>>(`${API_URL}/product-images/update-list`, images,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const deleteProduct = async (id: string): Promise<CustomResponse<Product>> => {
  try {
    const response = await axios.delete<CustomResponse<Product>>(`${API_URL}/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
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

export const createProductColorSizes = async (productColorSizes: ProductColorSizeRequest[]): Promise<CustomResponse<ProductColorSize>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post<CustomResponse<ProductColorSize>>(`${API_URL}/product-color-sizes/batch`, { productColorSizes }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}
export const getProductColorSizes = async (id: string): Promise<CustomResponse<ProductColorSize[]>> => {
  try {
    const response = await axios.get<CustomResponse<ProductColorSize[]>>(`${API_URL}/product-color-sizes/product/${id}`);
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const getProductColorSizesByProductId = async (id: string, page: number, size: number): Promise<CustomResponse<ProductColorSizeResponse>> => {
  try {
    const response = await axios.get<CustomResponse<ProductColorSizeResponse>>(`${API_URL}/product-color-sizes/product/${id}`,
      {
        params: {
          page, size
        }
      }
    );
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}

export const deleteProductImage = async (id: string): Promise<CustomResponse<ProductImage>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.delete<CustomResponse<ProductImage>>(`${API_URL}/product-images/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}
export const updateProductColorSize = async (id: string, productColorSize: ProductColorSizeRequest): Promise<CustomResponse<ProductColorSize>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.put<CustomResponse<ProductColorSize>>(`${API_URL}/product-color-sizes/${id}`, productColorSize, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
  catch (error: any) {
    return error.response.data;
  }
}