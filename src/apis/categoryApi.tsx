import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { CategoryResponse } from "../types/category/CategoryResponse";
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