import { Product } from "../product/Product";

export interface OrderDetailRequest {
    productCost: number;
    quantity: number;
    unitPrice: number;
    total: number;
    product: Product;
    orderId: string;
}
