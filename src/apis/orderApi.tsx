import axios from "axios";
import { OrderResponse } from "../types/order/OrderResponse";
import { OrderDetail } from "../types/order/OrderDetail";
import { Order } from "../types/order/Order";
import { OrderRequestUpdate } from "../types/order/OrderRequestUpdate";
import { CustomResponse } from "../types/common/CustomResponse";
import { OrderCreatedRequest } from "../types/order/OrderCreatedRequest";
import { OrderDetailCreated } from "../types/order/OrderDetailCreated";
import { OrderDetailResponse } from "../types/order/OrderDetailResponse";
import { OrderDetailUpdate } from "../types/order/OrderDetailUpdate";
const API_URL = import.meta.env.VITE_API_URL;

export const getOrders = async (page: number, perpage: number, status: string = "", sort: string = "createdAt,asc"): Promise<CustomResponse<OrderResponse>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<OrderResponse>>(`${API_URL}/orders/search`, {
            params: {
                page,
                perpage,
                sort,
                status
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
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
export const getOrderById = async (id: string): Promise<CustomResponse<Order>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<Order>>(`${API_URL}/orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const updateOrder = async (id: string, order: OrderRequestUpdate): Promise<CustomResponse<Order>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.put<CustomResponse<Order>>(`${API_URL}/orders/${id}`, order,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const deleteOrder = async (id: string): Promise<CustomResponse<Order>> => {
    try {
        const response = await axios.delete<CustomResponse<Order>>(`${API_URL}/orders/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const createOrder = async (order: OrderCreatedRequest): Promise<CustomResponse<Order>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post<CustomResponse<Order>>(`${API_URL}/orders`, order,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const createListOrderDetails = async (orderDetails: OrderDetailCreated[]): Promise<CustomResponse<OrderDetail[]>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post<CustomResponse<OrderDetail[]>>(`${API_URL}/order-details/batch`, orderDetails,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getOrderDetailByOrderId = async (id: string): Promise<CustomResponse<OrderDetailResponse[]>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<OrderDetailResponse[]>>(`${API_URL}/order-details/order/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const updateOrderDetail = async (id: string, orderDetail: OrderDetailUpdate): Promise<CustomResponse<OrderDetail>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.put<CustomResponse<OrderDetail>>(`${API_URL}/order-details/${id}`, orderDetail,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const createOrderDetail = async (orderDetail: OrderDetailCreated): Promise<CustomResponse<OrderDetail>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post<CustomResponse<OrderDetail>>(`${API_URL}/order-details`, orderDetail,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}