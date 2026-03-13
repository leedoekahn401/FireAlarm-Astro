import type { APIRoute } from "astro";
import { cartController } from "../../../../controller/cart.controller";

export const prerender = false;

export const GET: APIRoute = async (context) => {
    return await cartController.getCartItems(context);
}

export const POST: APIRoute = async (context) => {
    return await cartController.addCartItems(context);
}

export const DELETE: APIRoute = async (context) => {
    // For single item removal if we had /api/cart/[id], but for now we can use query params or handle in separate file
    // Implementing a basic one for consistency
    return await cartController.removeCartItem(context as any);
}

export const PATCH: APIRoute = async (context) => {
    return await cartController.updateCartItemQuantity(context as any);
}