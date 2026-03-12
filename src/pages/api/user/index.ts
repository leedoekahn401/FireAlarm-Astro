import type { APIRoute } from "astro";
import { userController } from "../../../../controller/user.controller";
export const prerender = false; 

export const GET: APIRoute = async (context) => {
    return userController.getUserInfo(context);
}