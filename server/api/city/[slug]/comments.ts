import {defineEventHandler, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const amountOfComments = 10;
    const shouldSkip = {
        skip: undefined,
        cursor: undefined
    };

    const {slug} = event.context.params

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
            city: {
                slug
            },
            OR: [
                {
                    public: true
                },
                {
                    public: false,
                    authorId: event.context.user?.id ?? 0
                }
            ]
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
                                    trans_name: true
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
                            icon: true,
                            trans_name: true
                        }
                    }
                }
            }
        }
    })
})
