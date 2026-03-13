import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { auth } from "../lib/auth";

export const cartController= {
    async getCartItems({ request }: { request: Request }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) return Response.json({ error: "Unauthenticated" }, { status: 401 });

            const cart = await prisma.cart.findFirst({
                where: { user_id: session.user.id },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            return Response.json({ data: cart?.items || [] }, { status: 200 });
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 });
        }
    },
    async addCartItems({ request }: { request: Request }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) return Response.json({ error: "Unauthenticated" }, { status: 401 });

            const body = await request.json();
            const { product_id, quantity = 1 } = body;

            if (!product_id) return Response.json({ error: "Product ID is required" }, { status: 400 });

            // Ensure cart exists
            let cart = await prisma.cart.findFirst({
                where: { user_id: session.user.id }
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { user_id: session.user.id }
                });
            }

            // Upsert item
            const cartItem = await prisma.cartItem.upsert({
                where: {
                    cart_id_product_id: {
                        cart_id: cart.uuid,
                        product_id: product_id
                    }
                },
                update: {
                    quantity: { increment: quantity }
                },
                create: {
                    cart_id: cart.uuid,
                    product_id: product_id,
                    quantity: quantity
                }
            });

            return Response.json({ data: cartItem, message: "Item added to cart" }, { status: 200 });
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 });
        }
    },
    async removeCartItem({ request, params }: { request: Request, params: any }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) return Response.json({ error: "Unauthenticated" }, { status: 401 });

            const itemId = params.id;
            await prisma.cartItem.delete({
                where: { uuid: itemId }
            });

            return Response.json({ message: "Item removed from cart" }, { status: 200 });
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 });
        }
    },
    async updateCartItemQuantity({ request, params }: { request: Request, params: any }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) return Response.json({ error: "Unauthenticated" }, { status: 401 });

            const itemId = params.id;
            const { quantity } = await request.json();

            if (quantity <= 0) {
                await prisma.cartItem.delete({ where: { uuid: itemId } });
                return Response.json({ message: "Item removed from cart" }, { status: 200 });
            }

            const updated = await prisma.cartItem.update({
                where: { uuid: itemId },
                data: { quantity }
            });

            return Response.json({ data: updated }, { status: 200 });
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 });
        }
    }
}