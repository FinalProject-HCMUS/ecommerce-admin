export interface OrderCreatedRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    status: string;
    deliveryDate: string;
    paymentMethod: string;
    shippingCost: number;
    productCost: number;
    subTotal: number;
    total: number;
}

export const defaultOrderCreatedRequest: OrderCreatedRequest = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    status: "NEW",
    deliveryDate: "",
    paymentMethod: "COD",
    shippingCost: 0,
    productCost: 0,
    subTotal: 0,
    total: 0,
};
