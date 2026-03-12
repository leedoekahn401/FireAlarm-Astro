import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { auth } from "../lib/auth"
export const userController = {
    async getUserInfo({ request }: { request: Request }) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers
            })
            if (!session) return Response.json({ error: "Unauthenticated" }, { status: 401 });

            const user = session.user;
            const data = {
                name: user.name,
                email: user.email,
                image: user.image
            }

            return Response.json({ data: data }, { status: 200 });

        } catch (error) {
            console.error(error);
            return Response.json({ error: "Query Failed" }, { status: 500 });
        }
    }
}