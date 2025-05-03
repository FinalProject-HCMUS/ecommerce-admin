/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "..";
import { Pageable } from "../common/Pageable";


export interface CategoryResponse {
    content: Category[];
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