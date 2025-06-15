import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { User } from "../types/user/User";
import { UserRequest } from "../types/user/UserRequest";

const API_URL = import.meta.env.VITE_API_URL;
export const getProfile = async (): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_URL}/users/me`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const updateProfile = async (id: string, user: UserRequest): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.put(`${API_URL}/users/${id}`, user,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const changePassword = async (id: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<CustomResponse<string>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(`${API_URL}/users/${id}/change-password`, {
            currentPassword,
            newPassword,
            confirmPassword
        },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}