import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { User } from "../types/user/User";
import { UserRequest } from "../types/user/UserRequest";
import apiClient from "./axiosConfig";

const API_URL = import.meta.env.VITE_API_URL;
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