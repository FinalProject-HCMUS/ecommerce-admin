import { Pageable } from "../common/Pageable";
import { Blog } from "./blog";

export interface BlogResponse {
    content: Blog[];
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