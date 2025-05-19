import { Product } from "../product/Product";

export interface OrderDetail {
    id: string;
    productCost: number;
    quantity: number;
    unitPrice: number;
    total: number;
    product: Product;
    orderId: string;
}