/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomResponse } from "../types/common/CustomResponse";
import { CategoryResponse } from "../types/category/CategoryResponse";
import { CategoryRequest } from "../types/category/CategoryRequest";
import { Category } from "../types/category/Category";
import apiClient from "./axiosConfig";

export const getCategories = async (page: number, perpage: number, keyword: string = ""): Promise<CustomResponse<CategoryResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<CategoryResponse>>(`/categories`, {
            params: { page, perpage, keyword }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getAllCategories = async (): Promise<CustomResponse<Category[]>> => {
    try {
        const response = await apiClient.get<CustomResponse<Category[]>>(`/categories/all`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getCategoryById = async (categoryId: string): Promise<CustomResponse<Category>> => {
    try {
        const response = await apiClient.get<CustomResponse<Category>>(`/categories/${categoryId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const updateCategory = async (categoryId: string, categoryData: CategoryRequest): Promise<CustomResponse<Category>> => {
    try {
        const response = await apiClient.put<CustomResponse<Category>>(`/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const addCategory = async (categoryData: CategoryRequest): Promise<CustomResponse<Category>> => {
    try {
        const response = await apiClient.post<CustomResponse<Category>>(`/categories`, categoryData);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const deleteCategory = async (categoryId: string): Promise<CustomResponse<Category>> => {
    try {
        const response = await apiClient.delete<CustomResponse<Category>>(`/categories/${categoryId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

