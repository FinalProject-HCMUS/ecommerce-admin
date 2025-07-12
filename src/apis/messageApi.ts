import { CustomResponse } from "../types/common/CustomResponse";
import { ConversationResponse } from "../types/message/ConversationResponse";
import { Message } from "../types/message/Message";
import apiClient from "./axiosConfig";

export const getConversations = async (page: number, size: number, keyword: string, sort: string = "updatedAt,asc"): Promise<CustomResponse<ConversationResponse>> => {
    try {
        const response = await apiClient.get<CustomResponse<ConversationResponse>>(`/conversations/search`, {
            params: { page, size, keyword, sort }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}

export const getMessagesByConversationId = async (conversationId: string): Promise<CustomResponse<Message[]>> => {
    try {
        const response = await apiClient.get<CustomResponse<Message[]>>(`/messages/conversation/${conversationId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}