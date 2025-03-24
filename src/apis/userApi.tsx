import axios from "axios";
import { User } from "../types";
const API_URL = "./data.json";
export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get<{ users: User[] }>(API_URL);
    return response.data.users;
};