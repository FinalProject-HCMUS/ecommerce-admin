import axios from "axios";
import { CustomResponse } from "../types/color/common/CustomResponse";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadImages = async (data: File[]): Promise<CustomResponse<string[]>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const files = new FormData();
        data.forEach((file) => {
            files.append("files", file);
        });
        const response = await axios.post<CustomResponse<string[]>>(
            `${API_URL}/images/upload/batch`,
            files,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: "Unknown error" };
    }
};
export const uploadImage = async (data: File): Promise<CustomResponse<string>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const files = new FormData();
        files.append("file", data);
        const response = await axios.post<CustomResponse<string>>(
            `${API_URL}/images/upload`,
            files,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: "Unknown error" };
    }
};

