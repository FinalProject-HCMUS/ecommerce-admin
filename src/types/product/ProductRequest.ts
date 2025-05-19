export interface ProductRequest {
    categoryId: string;
    categoryName: string;
    cost: number;
    enable: boolean;
    inStock: boolean;
    name: string;
    price: number;
    description: string;
    discountPercent: number;
    mainImageUrl: string;
}