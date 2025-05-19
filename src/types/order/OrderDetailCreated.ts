export interface OrderDetailCreated {
    productCost: number;
    quantity: number;
    unitPrice: number;
    total: number;
    itemId: string;
    orderId: string;
}