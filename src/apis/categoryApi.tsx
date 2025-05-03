import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { CategoryResponse } from "../types/category/CategoryResponse";
import { CategoryRequest } from "../types/category/CategoryRequest";
import { Category } from "../types/category/Category";
const API_URL = import.meta.env.VITE_API_URL;
export const getCategories = async (page: number, perpage: number): Promise<CategoryResponse> => {
    const response = await axios.get<CustomResponse<CategoryResponse>>(`${API_URL}/categories`, {
        params: {
            page, perpage
        },
    });
    if (!response.data.isSuccess || !response.data.data) {
        throw new Error("Failed to fetch categories");
    }
    return response.data.data;
}
export const updateCategory = async (categoryId: string, categoryData: CategoryRequest): Promise<CustomResponse<Category>> => {
    const response = await axios.put<CustomResponse<Category>>(`${API_URL}/categories/${categoryId}`, categoryData);
    if (!response.data.isSuccess) {
        throw new Error("Failed to update category");
    }
    return response.data;
}