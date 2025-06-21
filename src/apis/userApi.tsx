import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { User } from "../types/user/User";
import { UserRequest } from "../types/user/UserRequest";
import { UserResponse } from "../types/user/UserResponse";
import { UserRequestCreated } from "../types/user/UserRequestCreated";

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
export const getUsers = async (page: number, perpage: number, keyword: string): Promise<CustomResponse<UserResponse>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<UserResponse>>(`${API_URL}/users/search`, {
            params: {
                page, perpage, keyword
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getUserById = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<User>>(`${API_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const createUser = async (user: UserRequestCreated): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post<CustomResponse<User>>(`${API_URL}/users`, user,
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
export const deleteUser = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.delete<CustomResponse<User>>(`${API_URL}/users/${id}`,
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
export const getUsers = async (page: number, perpage: number, keyword: string): Promise<CustomResponse<UserResponse>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<UserResponse>>(`${API_URL}/users/search`, {
            params: {
                page, perpage, keyword
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export const getUserById = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<User>>(`${API_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const createUser = async (user: UserRequestCreated): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post<CustomResponse<User>>(`${API_URL}/users`, user,
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
export const deleteUser = async (id: string): Promise<CustomResponse<User>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.delete<CustomResponse<User>>(`${API_URL}/users/${id}`,
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
    }
    catch (error: any) {
        return error.response.data;

    }
}
