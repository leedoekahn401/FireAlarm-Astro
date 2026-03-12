import { prisma } from "../lib/db";
import { Prisma } from "@prisma/client";
export const productController = {
    async getProductsList({ request }: { request: Request }) {
        try {
            const url = new URL(request.url);
            const searchParams = url.searchParams;

            const type = searchParams.get("type");
            const brand = searchParams.get("brand");
            const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000000");
            const minPrice = parseFloat(searchParams.get("minPrice") || "0");
            const sortBy = searchParams.get("sortBy") || "date_desc";
            const limit = parseInt(searchParams.get("limit")||"30",10);
            const page = parseInt(searchParams.get("page")||"1",10);
            const where: any = {
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                },
            };

            if (type) where.type = type;
            if (brand) where.brand = brand;

            let orderBy: any = { created_at: 'desc' };
            if (sortBy === "price_asc") orderBy = { price: 'asc' };
            else if (sortBy === "price_desc") orderBy = { price: 'desc' };
            else if (sortBy === "date_desc") orderBy = { created_at: 'desc' };

            const products = await prisma.product.findMany({
                where,
                orderBy,
                take: limit,
                skip: (page - 1) * limit,
            });

            return Response.json(
                { data: products },
                { status: 200 }
            )
        } catch (error: any) {
            console.error(error);
            return Response.json(
                { error: "Query Failed" },
                { status: 500 }
            )
        }
    },
    async getProduct({ params }: any) {
        try {
            const id: string = params.id;
            const product = await prisma.product.findUnique({where: {uuid: id}});
            return Response.json(
                {data: product},
                {status: 200}
            )

        } catch (error: any) {
            console.error(error);
            return Response.json(
                { error: "Query Failed" },
                { status: 500 }
            );
        }
    },
    async createProduct({ request }: { request: Request }) {
        try {
            const body = await request.json();
            const {
                name,
                price,
                stock,
                brand,
                type,
                info,
                description,
                picture_urls
            } = body;

            const data: any = {
                name,
                price: Prisma.Decimal(price),
            };

            if (stock !== undefined) data.stock = parseInt(stock);
            if (brand) data.brand = brand;
            if (type) data.type = type;
            if (info) data.info = info;
            if (description) data.description = description;
            if (picture_urls) data.picture_urls = picture_urls;

            const product = await prisma.product.create({
                data
            });

            return Response.json(
                {
                    data: product,
                    mesage: "Successfully created product"
                },
                { status: 200 }
            )
        } catch (error: any) {
            console.error(error);
            return Response.json(
                { error: "Query Failed" },
                { status: 500 }
            )
        }
    },
}
