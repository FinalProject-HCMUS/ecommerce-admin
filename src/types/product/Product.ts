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
    categoryId: string;
    categoryName: string;
}