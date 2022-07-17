import {createError, defineEventHandler, sendError, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const {q}: { q?: string } = useQuery(event)

    if (!q)
        return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request - Missing q parameter'}))

    return await prisma.city.findMany({
        take: 10,
        where: {
            name: {
                contains: q
            }
        },
        select: {
            name: true,
            slug: true,
            id: true
        }
    })
})
