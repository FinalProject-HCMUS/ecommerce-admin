import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { BlogResponse } from "../types/blog/BlogResponse";
import { BlogRequest } from "../types/blog/BlogRequest";
import { Blog } from "../types/blog/blog";

const API_URL = import.meta.env.VITE_API_URL;

export const getBlogs = async (page: number, size: number): Promise<CustomResponse<BlogResponse>> => {
    try {
        const response = await axios.get<CustomResponse<BlogResponse>>(`${API_URL}/blogs`, {
            params: {
                page,
                size,
            },
        });
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    };
}
export const getBlogById = async (id: string): Promise<CustomResponse<Blog>> => {
    try {
        const response = await axios.get<CustomResponse<Blog>>(`${API_URL}/blogs/${id}`);
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    };
}
export const updateBlog = async (id: string, blog: BlogRequest): Promise<CustomResponse<Blog>> => {
    try {
        const response = await axios.put<CustomResponse<Blog>>(`${API_URL}/blogs/${id}`, blog);
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    };
}
export const addNewBlog = async (blog: BlogRequest): Promise<CustomResponse<Blog>> => {
    try {
        const response = await axios.post<CustomResponse<Blog>>(`${API_URL}/blogs`, blog);
        return response.data;
    }
    catch (error: any) {
        return error.response.data;
    };
}