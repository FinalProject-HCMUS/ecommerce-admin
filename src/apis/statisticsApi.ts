import { CustomResponse } from "../types/common/CustomResponse";
import { RevenueResponse } from "../types/statistics/RevenueResponse";
import { ProductCategoryResponse } from "../types/statistics/ProductCategoryResponse";
import { IncompletedOrderResponse } from "../types/statistics/IncompleteOrderResponse";
import { BestSellerProductResponse } from "../types/statistics/BestSellerProductResponse";
import apiClient from "./axiosConfig";

export const getRevenueResponse = async (type: string, date: string): Promise<CustomResponse<RevenueResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<RevenueResponse>>(`/statistics/analysis`, {
            params: { type, date }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getBestSellerProduct = async (type: string, date: string): Promise<CustomResponse<BestSellerProductResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<BestSellerProductResponse>>(`/statistics/best-sellers`, {
            params: { type, date }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getProductCategories = async (): Promise<CustomResponse<ProductCategoryResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<ProductCategoryResponse>>(`/statistics/product-categories`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getIncompleteOrders = async (): Promise<CustomResponse<IncompletedOrderResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<IncompletedOrderResponse>>(`/statistics/order-incomplete`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}