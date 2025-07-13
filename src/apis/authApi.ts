import axios from "axios";
import { Login } from "../types/auth/Login";
import { CustomResponse } from "../types/common/CustomResponse";
import { LoginResponse } from "../types/auth/LoginResponse";
const API_URL = import.meta.env.VITE_API_URL;
export const signin = async (login: Login): Promise<CustomResponse<LoginResponse>> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, login);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const refreshToken = async (refreshToken: string): Promise<CustomResponse<LoginResponse>> => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}