import { Pageable } from "../common/Pageable";
import { Order } from "./Order";

export interface OrderResponse {
    content: Order[];
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