import axios from "axios";
import { User } from "../types";
import { CustomResponse } from "../types/common/CustomResponse";
import { UserResponse } from "../types/customer/UserResponse";
import { UserRequest } from "../types/customer/UserRequest";
const API_URL = import.meta.env.VITE_API_URL;

export const getUsers = async (page: number, perpage: number): Promise<CustomResponse<UserResponse>> => {
    try {
        const response = await axios.get<CustomResponse<UserResponse>>(`${API_URL}/users`, {
            params: {
                page, perpage
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getUserById = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const response = await axios.get<CustomResponse<User>>(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const updateUser = async (id: string, userData: UserRequest): Promise<CustomResponse<User>> => {
    try {
        const response = await axios.put<CustomResponse<User>>(`${API_URL}/users/${id}`, userData);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const deleteUser = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const response = await axios.delete<CustomResponse<User>>(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}