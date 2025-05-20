import { Pageable } from "../common/Pageable";
import { Conversation } from "./Conversation";

export interface ConversationResponse {
    content: Conversation[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: any[];
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
