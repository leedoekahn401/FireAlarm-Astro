import type { APIRoute } from "astro";
import { productController } from "../../../../controller/product.controller";
export const prerender = false

export const GET: APIRoute = async (context)=>{
    return await productController.getProduct(context)
}