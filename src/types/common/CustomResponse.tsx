export interface CustomResponse<T> {
    timestamp: string;
    httpStatus: string;
    isSuccess: boolean;
    data?: T;
}