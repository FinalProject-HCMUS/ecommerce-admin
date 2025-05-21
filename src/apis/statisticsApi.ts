import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { RevenueResponse } from "../types/statistics/RevenueResponse";
import { ProductCategoryResponse } from "../types/statistics/ProductCategoryResponse";
import { IncompletedOrderResponse } from "../types/statistics/IncompleteOrderResponse";
import { BestSellerProductResponse } from "../types/statistics/BestSellerProductResponse";

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
export const getBestSellerProduct = async (type: string, date: string): Promise<CustomResponse<BestSellerProductResponse>> => {
    try {
        const acceessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<BestSellerProductResponse>>(`${API_URL}/statistics/best-sellers`, {
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
export const getProductCategories = async (): Promise<CustomResponse<ProductCategoryResponse>> => {
    try {
        const acceessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<ProductCategoryResponse>>(`${API_URL}/statistics/product-categories`, {
            headers: {
                Authorization: `Bearer ${acceessToken}`,
            }
        })
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getIncompleteOrders = async (): Promise<CustomResponse<IncompletedOrderResponse>> => {
    try {
        const acceessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<IncompletedOrderResponse>>(`${API_URL}/statistics/order-incomplete`, {
            headers: {
                Authorization: `Bearer ${acceessToken}`,
            }
        })
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}