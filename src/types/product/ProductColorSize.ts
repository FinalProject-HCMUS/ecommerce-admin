import { Color } from "../color/Color";
import { Size } from "../size/Size";

export interface ProductColorSize {
    productId: string;
    color: Color | null;
    size: Size | null;
    quantity: number;
}