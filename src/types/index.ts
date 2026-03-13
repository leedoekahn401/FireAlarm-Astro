export interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Product {
    uuid: string;
    name: string;
    price: number; // Decimal in Prisma, usually handled as number/Decimal in JS
    stock: number;
    brand: string | null;
    type: string | null;
    info: any;
    description: string | null;
    picture_urls: string[];
    created_at: Date | string;
}

export interface Cart {
    uuid: string;
    user_id: string | null;
    session_id: string | null;
    created_at: Date | string;
    updated_at: Date | string;
    items?: CartItem[];
}

export interface CartItem {
    uuid: string;
    cart_id: string | null;
    product_id: string | null;
    quantity: number;
    created_at: Date | string;
    product?: Product;
}

export interface Order {
    uuid: string;
    user_id: string | null;
    total: number;
    discount: number | null;
    status: string | null;
    shipping_address: string | null;
    payment_status: string | null;
    created_at: Date | string;
    order_items?: OrderItem[];
}

export interface OrderItem {
    uuid: string;
    order_id: string | null;
    product_id: string | null;
    quantity: number;
    unit_price: number;
    product?: Product;
}

export interface APIResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}
