import axios from "axios";
import { Order, OrderDetail } from "../types";
const API_URL = "./data.json";
export const getOrders = async (): Promise<Order[]> => {
    const response = await axios.get<{ orders: Order[] }>(API_URL);
    return response.data.orders;
};
export const getOrderDetails = async (id: string): Promise<OrderDetail[] | undefined> => {
    const response = await axios.get<{ orderDetails: OrderDetail[] }>(API_URL);
    const orderDetail = response.data.orderDetails.find((order) => order.id === id);
    return orderDetail ? [orderDetail] : undefined;
}