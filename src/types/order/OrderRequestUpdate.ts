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