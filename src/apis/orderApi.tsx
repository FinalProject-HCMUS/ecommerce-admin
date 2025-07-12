import { OrderResponse } from "../types/order/OrderResponse";
import { OrderDetail } from "../types/order/OrderDetail";
import { Order } from "../types/order/Order";
import { OrderRequestUpdate } from "../types/order/OrderRequestUpdate";
import { CustomResponse } from "../types/common/CustomResponse";
import { OrderCreatedRequest } from "../types/order/OrderCreatedRequest";
import { OrderDetailCreated } from "../types/order/OrderDetailCreated";
import { OrderDetailResponse } from "../types/order/OrderDetailResponse";
import { OrderDetailUpdate } from "../types/order/OrderDetailUpdate";
import apiClient from "./axiosConfig";

export const getOrders = async (page: number, perpage: number, status: string, paymentMethod: string, keyword: string, sort: string = "createdAt,asc"): Promise<CustomResponse<OrderResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<OrderResponse>>(`/orders/search`, {
            params: { page, perpage, status, paymentMethod, keyword, sort }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getOrderDetail = async (id: string): Promise<CustomResponse<OrderDetail[]>> => {
    try {
        const response = await apiClient.get<CustomResponse<OrderDetail[]>>(`/order-details/order/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}
export const getOrderById = async (id: string): Promise<CustomResponse<Order>> => {
    try {
        const response = await apiClient.get<CustomResponse<Order>>(`/orders/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}
export const updateOrder = async (id: string, order: OrderRequestUpdate): Promise<CustomResponse<Order>> => {
    try {
        const response = await apiClient.put<CustomResponse<Order>>(`/orders/${id}`, order);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const deleteOrder = async (id: string): Promise<CustomResponse<Order>> => {
    try {
        const response = await apiClient.delete<CustomResponse<Order>>(`/orders/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const createOrder = async (order: OrderCreatedRequest): Promise<CustomResponse<Order>> => {
    try {
        const response = await apiClient.post<CustomResponse<Order>>(`/orders`, order);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const createListOrderDetails = async (orderDetails: OrderDetailCreated[]): Promise<CustomResponse<OrderDetail[]>> => {
    try {
        const response = await apiClient.post<CustomResponse<OrderDetail[]>>(`/order-details/batch`, orderDetails);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getOrderDetailByOrderId = async (id: string): Promise<CustomResponse<OrderDetailResponse[]>> => {
    try {
        const response = await apiClient.get<CustomResponse<OrderDetailResponse[]>>(`/order-details/order/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const updateOrderDetail = async (id: string, orderDetail: OrderDetailUpdate): Promise<CustomResponse<OrderDetail>> => {
    try {
        const response = await apiClient.put<CustomResponse<OrderDetail>>(`/order-details/${id}`, orderDetail);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const createOrderDetail = async (orderDetail: OrderDetailCreated): Promise<CustomResponse<OrderDetail>> => {
    try {
        const response = await apiClient.post<CustomResponse<OrderDetail>>(`/order-details`, orderDetail);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}