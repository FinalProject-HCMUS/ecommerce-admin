import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { RevenueResponse } from "../types/statistics/RevenueResponse";

const API_URL = import.meta.env.VITE_API_URL;
export const getRevenueResponse = async (type: string, date: string): Promise<CustomResponse<RevenueResponse>> => {
    try {
        const acceessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<RevenueResponse>>(`${API_URL}/statistics/analysis`, {
            params: {
                type,
                date
            },
            headers: {
                Authorization: `Bearer ${acceessToken}`,
            }
        })
        return response.data;
    } catch (error: any) {
        return error.response.data;

    }
}