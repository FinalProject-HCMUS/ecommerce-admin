import { Color } from "../color/Color";
import { Size } from "../size/Size";

export interface ProductColorSize {
    id: string;
    productId: string;
    color: Color;
    size: Size;
    quantity: number;
}