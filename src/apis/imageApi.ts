import { CustomResponse } from "../types/common/CustomResponse";
import apiClient from "./axiosConfig";

export const uploadImages = async (data: File[]): Promise<CustomResponse<string[]>> => {
    try {
        const files = new FormData();
        data.forEach((file) => {
            files.append("files", file);
        });
        const response = await apiClient.post<CustomResponse<string[]>>(`/images/upload/batch`, files);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: "Network error" };
    }
};

export const uploadImage = async (data: File): Promise<CustomResponse<string>> => {
    try {
        const files = new FormData();
        files.append("file", data);
        const response = await apiClient.post<CustomResponse<string>>(`/images/upload`, files);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: "Network error" };
    }
};

