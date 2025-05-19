import { User } from "../user/User";

export interface ConversationResponse {
    id: string;
    customer: User
    latestMessage: string;
    adminRead: boolean;
    customerRead: boolean;
}