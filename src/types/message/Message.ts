export interface Message {
    id: string;
    content: string;
    userId: string;
    messageType: string; //text, image (text -> contentURL is null and )
    contentUrl: string;
}