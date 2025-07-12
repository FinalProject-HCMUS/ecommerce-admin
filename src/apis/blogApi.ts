import { CustomResponse } from "../types/common/CustomResponse";
import { BlogResponse } from "../types/blog/BlogResponse";
import { BlogRequest } from "../types/blog/BlogRequest";
import { Blog } from "../types/blog/blog";
import apiClient from "./axiosConfig";

export const getBlogs = async (page: number, size: number, sort: string = "createdAt,asc", keysearch: string = ""): Promise<CustomResponse<BlogResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<BlogResponse>>(`/blogs`, {
            params: { page, size, sort, keysearch }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getBlogById = async (id: string): Promise<CustomResponse<Blog>> => {
    try {
        const response = await apiClient.get<CustomResponse<Blog>>(`/blogs/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const updateBlog = async (id: string, blog: Blog): Promise<CustomResponse<Blog>> => {
    try {
        const response = await apiClient.put<CustomResponse<Blog>>(`/blogs/${id}`, blog);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const addNewBlog = async (blog: BlogRequest): Promise<CustomResponse<Blog>> => {
    try {
        const response = await apiClient.post<CustomResponse<Blog>>(`/blogs`, blog);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const deleteBlog = async (id: string): Promise<CustomResponse<Blog>> => {
    try {
        const response = await apiClient.delete<CustomResponse<Blog>>(`/blogs/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}