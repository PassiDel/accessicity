import {createError, defineEventHandler, sendError} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    // TODO: Add feature: update user profile

    return false
})
