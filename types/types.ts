export interface Color {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    created_at?: string;
}

export interface Cart {
    id?: number;
    color_id?: number;
    colors?: Color;
    user_id?: string;
    count?: number;
    created_at?: string;
}

export interface Dtrans {
    id?: number;
    htrans_id: number;
    htrans?: Htrans;
    color_id?: number;
    colors: Color;
    quantity?: number;
    price?: number;
    created_at?: string;
}

export interface Htrans {
    id?: number;
    dtrans?: Dtrans[];
    user_id: string;
    total?: number;
    status?: string;
    created_at?: string;
}

export interface ApiResponse {
    data?: any;
    message?: string;
    error?: string;
}
