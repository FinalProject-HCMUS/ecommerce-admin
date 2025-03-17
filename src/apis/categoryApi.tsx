import axios from "axios";
import { Category } from "../types";
const API_URL = './data.json';
export const getCategories = async (): Promise<Category[]> => {
    const response = await axios.get<{ categories: Category[] }>(API_URL);
    return response.data.categories;
}