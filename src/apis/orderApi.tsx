import axios from "axios";
import { OrderResponse } from "../types/order/OrderResponse";
import { CustomResponse } from "../types/common/CustomResponse";
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
