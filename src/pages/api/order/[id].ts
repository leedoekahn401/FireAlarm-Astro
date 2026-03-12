import type { APIRoute } from "astro";
import { orderController } from "../../../../controller/order.controller";
export const prerender = false;

export async function GET(context: any): Promise<APIRoute|any>{
    return await orderController.getOrder(context);
} 