import {createError, defineEventHandler, sendError, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    const userId = event.context.params.id
    const isUser = userId === event.context.user.id === userId

    const {page = '1'} = useQuery(event)

    // TODO: Add feature: get users comments

    return false
})
