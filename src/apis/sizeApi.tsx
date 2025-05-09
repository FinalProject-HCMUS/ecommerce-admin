/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CustomResponse } from "../types/color/common/CustomResponse";
import { SizeResponse } from "../types/size/SizeResponse";
import { SizeRequest } from "../types/size/SizeRequest";
import { Size } from "../types/size/Size";


const API_URL = import.meta.env.VITE_API_URL;
export const getSizes = async (page: number, perpage: number): Promise<CustomResponse<SizeResponse>> => {
    try {
        const response = await axios.get<CustomResponse<SizeResponse>>(`${API_URL}/sizes`, {
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
export const updateSize = async (SizeId: string, SizeData: SizeRequest): Promise<CustomResponse<Size>> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.put<CustomResponse<Size>>(`${API_URL}/sizes/${SizeId}`, SizeData, {
            headers
                : {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    }
}
export const addSize = async (SizeData: SizeRequest): Promise<CustomResponse<Size>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post<CustomResponse<Size>>(`${API_URL}/sizes`, SizeData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        },
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const deleteSize = async (SizeId: string): Promise<CustomResponse<Size>> => {
    try {
        const response = await axios.delete<CustomResponse<Size>>(`${API_URL}/sizes/${SizeId}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const getSizeById = async (SizeId: string): Promise<CustomResponse<Size>> => {
    try {
        const response = await axios.get<CustomResponse<Size>>(`${API_URL}/sizes/${SizeId}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

