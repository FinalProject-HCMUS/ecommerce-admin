import { Pageable } from "./common/Pageable";
import { Color } from "./Color";

export interface ColorResponse {
    content: Color[];
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