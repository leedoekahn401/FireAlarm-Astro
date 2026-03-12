import type { APIRoute } from 'astro';
import { productController } from '../../../../controller/product.controller';
export const prerender = false; 


export const GET: APIRoute = async (context) => {
    return await productController.getProductsList(context);
}

export const POST: APIRoute = async (context) => {
    return await productController.createProduct(context);
}