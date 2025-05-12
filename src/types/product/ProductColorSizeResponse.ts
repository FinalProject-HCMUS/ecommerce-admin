import { Color } from "../color/Color";
import { Size } from "../size/Size";

export interface ProductColorSizeResponse {
    id: string;
    productId: string;
    quantity: number;
    color: Color;
    size: Size;
}