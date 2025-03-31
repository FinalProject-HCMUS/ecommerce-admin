import axios from "axios";
import { Blog } from "../types";
const API_URL = './data.json';
export const getBlogs = async (): Promise<Blog[]> => {
    const response = await axios.get<{ blogs: Blog[] }>(API_URL);
    return response.data.blogs;
}