import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GG_AUTH_CLIENT_ID as string,
            clientSecret: process.env.GG_AUTH_CLIENT_SECRET as string,
        },
    },
    baseURL: process.env.BETTER_AUTH_URL,
    advanced: {
        database: {
            generateId: "uuid"
        }
    }
});
