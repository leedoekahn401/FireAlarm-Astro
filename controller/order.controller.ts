import { auth } from "../lib/auth";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";

export const orderController = {
    async getOrders({ request }: any) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) {
                return Response.json({ error: "Unauthenticated" }, { status: 401 });
            }
            const url = new URL(request)
            const searchParams = url.searchParams;
            const limit = parseInt(searchParams.get('limit') || '20');
            const page = parseInt(searchParams.get('page') || '1');

            const orders = await prisma.order.findMany({
                where: {
                    user_id: session.user.id
                },
                take: limit,
                skip: (page - 1) * limit
            })
            return Response.json({ data: orders }, { status: 200 });
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 })
        }
    },
    async getOrder({ request, params }: { request: Request, params: any }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) {
                return Response.json({ error: "Unauthenticated" }, { status: 401 });
            }
            const id = params.id;
            const order = await prisma.order.findUnique({
                where: { uuid: id }
            })
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 })
        }
    },
    async createOrder({ request }: { request: Request }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            });
            if (!session) {
                return Response.json({ error: "Unauthenticated" }, { status: 401 });
            }

            const body = await request.json();
            const { items, shipping_address } = body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return Response.json({ error: "Items are required" }, { status: 400 });
            }

            // Get product details for all items to calculate total and verify existence
            const productIds = items.map((item: any) => item.product_id);
            const products = await prisma.product.findMany({
                where: {
                    uuid: { in: productIds }
                }
            });

            if (products.length !== productIds.length) {
                return Response.json({ error: "One or more products not found" }, { status: 400 });
            }

            const productMap = new Map(products.map(p => [p.uuid, p]));
            let total = new Prisma.Decimal(0);

            const orderItemsData = items.map((item: any) => {
                const product = productMap.get(item.product_id);
                if (!product) throw new Error("Product data missing");

                const quantity = item.quantity || 1;
                const price = product.price;
                total = total.plus(price.times(quantity));

                return {
                    product_id: item.product_id,
                    quantity: quantity,
                    unit_price: price
                };
            });

            const result = await prisma.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        user_id: session.user.id,
                        total: total,
                        shipping_address: shipping_address,
                        status: "pending",
                        payment_status: "unpaid",
                        order_items: {
                            create: orderItemsData
                        }
                    },
                    include: {
                        order_items: true
                    }
                });
                return order;
            });

            return Response.json({ data: result }, { status: 201 });
        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 })
        }
    },
}