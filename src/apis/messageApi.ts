import axios from "axios";
import { CustomResponse } from "../types/common/CustomResponse";
import { ConversationResponse } from "../types/message/ConversationResponse";
import { Message } from "../types/message/Message";

const API_URL = import.meta.env.VITE_API_URL;
export const getConversations = async (page: number, size: number, keyword: string, sort: string = "createdAt,asc"): Promise<CustomResponse<ConversationResponse>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<ConversationResponse>>(`${API_URL}/conversations/search`, {
            params: {
                page: page,
                size: size,
                keyword: keyword,
                sort: sort
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

export const getMessagesByConversationId = async (conversationId: string): Promise<CustomResponse<Message[]>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get<CustomResponse<Message[]>>(`${API_URL}/messages/conversation/${conversationId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}