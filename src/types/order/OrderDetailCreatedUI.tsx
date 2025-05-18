import { Color } from "../color/Color";
import { Product } from "../product/Product";
import { Size } from "../size/Size";

export interface OrderDetailCreatedUI {
    productCost: number;
    quantity: number;
    unitPrice: number;
    total: number;
    itemId: string
    product: Product;
    color: Color;
    orderId: string;
    size: Size;
    limitedQuantity: number;
}