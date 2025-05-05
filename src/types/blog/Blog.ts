export interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    userId: string;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
}