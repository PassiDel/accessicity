import {defineEventHandler, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const amountOfComments = 10;
    const shouldSkip = {
        skip: undefined,
        cursor: undefined
    };

    const cityId = parseInt(event.context.params.id)

    const {pointer = undefined} = useQuery(event)

    if (typeof pointer === "string") {
        shouldSkip.skip = 1
        shouldSkip.cursor = {id: parseInt(pointer)}
    }

    return await prisma.comment.findMany({
        take: amountOfComments,
        orderBy: {
            createdAt: 'desc'
        },
        ...shouldSkip,
        where: {
            cityId,
            public: true
        },
        select: {
            id: true,
            createdAt: true,
            title: true,
            message: true,
            rating: true,
            author: {
                select: {
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
                                }
                            }
                        },
                        orderBy: {
                            verified: 'desc'
                        }
                    }
                }
            },
            disability: {
                select: {
                    rating: true,
                    disability: {
                        select: {
                            id: true,
                            slug: true,
                            icon: true
                        }
                    }
                }
            }
        }
    })
})
