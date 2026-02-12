import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
});

export interface RawMaterial {
    id?: number;
    name: string;
    stockQuantity: number;
}

export interface Product {
    id?: number;
    name: string;
    value: number;
}

export interface ProductionSuggestionDTO {
    productName: string;
    quantity: number;
    totalValue: number;
}