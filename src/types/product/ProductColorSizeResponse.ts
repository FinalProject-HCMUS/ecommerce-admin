import { Pageable } from "../common/Pageable";
import { ProductColorSize } from "./ProductColorSize";

export interface ProductColorSizeResponse {
    content: ProductColorSize[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: any[];
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}