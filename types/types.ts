export interface Color {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
}

export interface Cart {
    id?: number;
    color_id?: number;
    colors?: Color;
    user_id?: string;
    count?: number;
}
