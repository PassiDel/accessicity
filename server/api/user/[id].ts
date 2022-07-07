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
            },
            comments: {
                take: 5,
                select: {
                    id: true,
                    createdAt: true,
                    title: true,
                    message: true,
                    rating: true,
                    city: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    disability: {
                        select: {
                            rating: true,
                            disability: {
                                select: {
                                    id: true,
                                    name: true,
                                    trans_name: true,
                                    slug: true,
                                    icon: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }})

    if (!user)
        return sendError(event, createError({statusCode: 404, statusMessage: 'Not found'}))

    return {
        user
    }
})
