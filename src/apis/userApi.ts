import { CustomResponse } from "../types/common/CustomResponse";
import { User } from "../types/user/User";
import { UserRequest } from "../types/user/UserRequest";
import { UserResponse } from "../types/user/UserResponse";
import { UserRequestCreated } from "../types/user/UserRequestCreated";
import apiClient from "./axiosConfig";

export const getProfile = async (): Promise<CustomResponse<User>> => {
    try {
        const response = await apiClient.get(`/users/me`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const updateProfile = async (id: string, user: UserRequest): Promise<CustomResponse<User>> => {
    try {
        const response = await apiClient.put(`/users/${id}`, user);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getUsers = async (page: number, perpage: number, keyword: string): Promise<CustomResponse<UserResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<UserResponse>>(`/users/search`, {
            params: { page, perpage, keyword }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getUserById = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const response = await apiClient.get<CustomResponse<User>>(`/users/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const createUser = async (user: UserRequestCreated): Promise<CustomResponse<User>> => {
    try {
        const response = await apiClient.post<CustomResponse<User>>(`/users`, user);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}


export const changePassword = async (id: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<CustomResponse<string>> => {
    try {
        const response = await apiClient.post(`/users/${id}/change-password`, {
            currentPassword,
            newPassword,
            confirmPassword
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}