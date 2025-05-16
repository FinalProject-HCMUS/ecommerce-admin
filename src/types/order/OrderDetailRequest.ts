import { Color } from "../color/Color";
import { Product } from "../product/Product";
import { Size } from "../size/Size";

export interface OrderDetailRequest {
    productCost: number;
    quantity: number;
    unitPrice: number;
    total: number;
    itemId: string
    product: Product;
    color: Color;
    size: Size;
    limitedQuantity: number;
}
