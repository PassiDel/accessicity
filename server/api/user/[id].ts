import {createError, defineEventHandler, sendError} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = parseInt(event.context.params.id);
    if (id === 0 || isNaN(id))
        return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request - Invalid user id'}))

    const user = await prisma.user.findUnique({
        where: {id}, select: {
            id: true,
            name: true,
            createdAt: true,
            email: (event.context.user && event.context.user.id === id) || false,
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
