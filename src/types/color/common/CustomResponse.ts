export interface CustomResponse<T> {
    timestamp: string;
    httpStatus: string;
    isSuccess: boolean;
    message: string;
    subErrors?: unknown;
    data?: T;
}