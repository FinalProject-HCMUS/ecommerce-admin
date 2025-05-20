import { User } from "../user/User";
import { Message } from "./Message";

export interface Conversation {
    id: string;
    customer: User
    latestMessage: Message;
    adminRead: boolean;
    customerRead: boolean;
}
