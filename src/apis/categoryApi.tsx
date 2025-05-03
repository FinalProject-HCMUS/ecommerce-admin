/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { CategoryResponse } from "../types/category/CategoryResponse";
import { CategoryRequest } from "../types/category/CategoryRequest";
import { Category } from "../types/category/Category";
const API_URL = import.meta.env.VITE_API_URL;
export const getCategories = async (page: number, perpage: number): Promise<CustomResponse<CategoryResponse>> => {
    try {
        const response = await axios.get<CustomResponse<CategoryResponse>>(`${API_URL}/categories`, {
            params: {
                page, perpage
            },
        });
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    }
}
export const updateCategory = async (categoryId: string, categoryData: CategoryRequest): Promise<CustomResponse<Category>> => {
    try {
        const response = await axios.put<CustomResponse<Category>>(`${API_URL}/categories/${categoryId}`, categoryData);
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    }
}
export const addCategory = async (categoryData: CategoryRequest): Promise<CustomResponse<Category>> => {
    try {
        const response = await axios.post<CustomResponse<Category>>(`${API_URL}/categories`, categoryData);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const deleteCategory = async (categoryId: string): Promise<CustomResponse<Category>> => {
    try {
        const response = await axios.delete<CustomResponse<Category>>(`${API_URL}/categories/${categoryId}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

