import {createError, defineEventHandler, sendError} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    const user = await prisma.user.findUnique({where: {id: event.context.user.id}, select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }})

    return {
        user
    }
})
