/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CustomResponse } from "../types/color/common/CustomResponse";
import { ColorResponse } from "../types/color/ColorResponse";
import { ColorRequest } from "../types/color/ColorRequest";
import { Color } from "../types/color/Color";

const API_URL = import.meta.env.VITE_API_URL;
export const getColors = async (page: number, size: number, keyword: string = ""): Promise<CustomResponse<ColorResponse>> => {
    try {
        const response = await axios.get<CustomResponse<ColorResponse>>(`${API_URL}/colors`, {
            params: {
                page, size, keyword
            },
        });
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    }
}
export const updateColor = async (ColorId: string, ColorData: ColorRequest): Promise<CustomResponse<Color>> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.put<CustomResponse<Color>>(`${API_URL}/colors/${ColorId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            ColorData
        });
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    }
}
export const addColor = async (ColorData: ColorRequest): Promise<CustomResponse<ColorRequest>> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post<CustomResponse<ColorRequest>>(
            `${API_URL}/colors`,
            ColorData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const deleteColor = async (ColorId: string): Promise<CustomResponse<Color>> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.delete<CustomResponse<Color>>(`${API_URL}/colors/${ColorId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getColorById = async (ColorId: string): Promise<CustomResponse<Color>> => {
    try {
        const response = await axios.get<CustomResponse<Color>>(`${API_URL}/colors/${ColorId}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

