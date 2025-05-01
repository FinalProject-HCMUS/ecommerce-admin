export interface Product {
    id: string;
    name: string;
    description: string;
    cost: number;
    total: number;
    price: number;
    discountPercent: number;
    enable: boolean;
    inStock: boolean;
    mainImageUrl: string;
    averageRating: number;
    reviewCount: number;
    categoryId: string;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}