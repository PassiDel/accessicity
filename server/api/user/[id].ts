import {createError, defineEventHandler, sendError} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))


    const user = await prisma.user.findUnique({where: {id: parseInt(event.context.params.id)}, select: {
            id: true,
            name: true,
            createdAt: true,
            disabilitys: {
                select: {
                    verified: true,
                    createdAt: true,
                    disability: {
                        select: {
                            id: true,
                            slug: true,
                            icon: true,
                            trans_name: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    verified: 'desc'
                }
            }
        }})

    if (!user)
        return sendError(event, createError({statusCode: 404, statusMessage: 'Not found'}))

    return {
        user
    }
})
