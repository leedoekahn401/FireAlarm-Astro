import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { auth } from "../lib/auth";

export const cartController= {
    async getCartItems({request}:{request: Request}){
        const session = auth.api.getSession({
            headers: request.headers
        })
        
    }
}