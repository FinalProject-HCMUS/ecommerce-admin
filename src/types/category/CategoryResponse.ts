/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pageable } from "../color/common/Pageable";
import { Category } from "./Category";


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