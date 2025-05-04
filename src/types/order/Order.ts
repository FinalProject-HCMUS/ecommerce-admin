import { OrderTrack } from "./OrderTrack";
export interface Order {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: string;
    deliveryDate: string;
    paymentMethod: string;
    shippingCost: number;
    productCost: number;
    subTotal: number;
    total: number;
    customerId: string;
    orderTracks: OrderTrack[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}