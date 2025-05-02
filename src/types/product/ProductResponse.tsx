import { Pageable } from "../common/Pageable";
import { Product } from "./Product";

export interface ProductResponse {
    content: Product[];
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