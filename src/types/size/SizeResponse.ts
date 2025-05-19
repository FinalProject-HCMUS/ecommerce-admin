import { Pageable } from "../common/Pageable";
import { Size } from "./Size";

export interface SizeResponse {
    content: Size[];
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