/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomResponse } from "../types/common/CustomResponse";
import { ColorResponse } from "../types/color/ColorResponse";
import { ColorRequest } from "../types/color/ColorRequest";
import { Color } from "../types/color/Color";
import apiClient from "./axiosConfig";

export const getColors = async (page: number, size: number, keyword: string = ""): Promise<CustomResponse<ColorResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<ColorResponse>>(`/colors`, {
            params: { page, size, keyword }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const updateColor = async (ColorId: string, ColorData: ColorRequest): Promise<CustomResponse<Color>> => {
    try {
        const response = await apiClient.put<CustomResponse<Color>>(`/colors/${ColorId}`, ColorData);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const addColor = async (ColorData: ColorRequest): Promise<CustomResponse<ColorRequest>> => {
    try {
        const response = await apiClient.post<CustomResponse<ColorRequest>>(`/colors`, ColorData);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const deleteColor = async (ColorId: string): Promise<CustomResponse<Color>> => {
    try {
        const response = await apiClient.delete<CustomResponse<Color>>(`/colors/${ColorId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getColorById = async (ColorId: string): Promise<CustomResponse<Color>> => {
    try {
        const response = await apiClient.get<CustomResponse<Color>>(`/colors/${ColorId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}