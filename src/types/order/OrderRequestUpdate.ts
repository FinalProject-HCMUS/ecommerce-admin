export interface OrderRequestUpdate {
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
}
export const defaultOrderRequestUpdate: OrderRequestUpdate = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    status: "",
    deliveryDate: "",
    paymentMethod: "",
    shippingCost: 0,
    productCost: 0,
    subTotal: 0,
    total: 0,
    customerId: "",
};