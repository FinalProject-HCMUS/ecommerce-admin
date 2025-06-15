/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: any[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
}