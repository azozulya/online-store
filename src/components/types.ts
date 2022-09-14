export interface IProduct {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnail: string;
    description: string;
    rating: number;
    stock: number;
    brand: string;
    discountPercentage?: number;
    isFavorite?: boolean;
    inBasket?: boolean;
}

export interface IFilter {
    category: string;
    brand: string[];
    rating: number;
    price: IRange;
    inStock: boolean;
}

export interface IRange {
    min: number;
    max: number;
}
export interface ISortItem {
    title: string;
    value: string;
}

export interface IBrand {
    [name: string]: number;
}

export interface ICategory {
    [name: string]: number;
}
