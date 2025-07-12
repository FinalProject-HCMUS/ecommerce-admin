/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomResponse } from "../types/common/CustomResponse";
import { SizeResponse } from "../types/size/SizeResponse";
import { SizeRequest } from "../types/size/SizeRequest";
import { Size } from "../types/size/Size";
import apiClient from "./axiosConfig";


export const getSizes = async (page: number, size: number, keyword: string = "", minHeight: number = 0, maxHeight: number = 500, minWeight: number = 0, maxWeight: number = 500): Promise<CustomResponse<SizeResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<SizeResponse>>(`/sizes`, {
            params: { page, size, keyword, minHeight, maxHeight, minWeight, maxWeight }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const updateSize = async (SizeId: string, SizeData: SizeRequest): Promise<CustomResponse<Size>> => {
    try {
        const response = await apiClient.put<CustomResponse<Size>>(`/sizes/${SizeId}`, SizeData);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const addSize = async (SizeData: SizeRequest): Promise<CustomResponse<Size>> => {
    try {
        const response = await apiClient.post<CustomResponse<Size>>(`/sizes`, SizeData);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const deleteSize = async (SizeId: string): Promise<CustomResponse<Size>> => {
    try {
        const response = await apiClient.delete<CustomResponse<Size>>(`/sizes/${SizeId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getSizeById = async (SizeId: string): Promise<CustomResponse<Size>> => {
    try {
        const response = await apiClient.get<CustomResponse<Size>>(`/sizes/${SizeId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}
