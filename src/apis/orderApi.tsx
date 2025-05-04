import axios from "axios";
import { OrderResponse } from "../types/order/OrderResponse";
import { CustomResponse } from "../types/common/CustomResponse";
import { OrderDetail } from "../types/order/OrderDetail";
import { Order } from "../types/order/Order";
import { OrderRequestUpdate } from "../types/order/OrderRequestUpdate";
const API_URL = import.meta.env.VITE_API_URL;

export const getOrders = async (page: number, perpage: number): Promise<CustomResponse<OrderResponse>> => {
    try {
        const response = await axios.get<CustomResponse<OrderResponse>>(`${API_URL}/orders`, {
            params: {
                page,
                perpage,
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getOrderDetail = async (id: string): Promise<CustomResponse<OrderDetail[]>> => {
    try {
        const response = await axios.get<CustomResponse<OrderDetail[]>>(`${API_URL}/order-details/order/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const updateOrder = async (id: string, order: OrderRequestUpdate): Promise<CustomResponse<Order>> => {
    try {
        const response = await axios.put<CustomResponse<Order>>(`${API_URL}/orders/${id}`, order);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}