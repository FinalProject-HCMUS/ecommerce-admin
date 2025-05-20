import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { ConversationResponse } from "../types/message/ConversationResponse";

const API_URL = import.meta.env.VITE_API_URL;
export const getConversations = async (page: number, size: number): Promise<CustomResponse<ConversationResponse>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<ConversationResponse>>(`${API_URL}/conversations`, {
            params: {
                page: page,
                size: size
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}