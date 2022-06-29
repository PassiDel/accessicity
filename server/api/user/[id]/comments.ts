import {createError, defineEventHandler, sendError, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    const amountOfComments = 10;
    const shouldPublic = {
        public: undefined
    };
    const shouldSkip = {
        skip: undefined,
        cursor: undefined
    };

    const userId = parseInt(event.context.params.id)

    const isUser = userId === event.context.user.id
    if (!isUser) {
        shouldPublic.public = true

    }

    const {pointer = undefined} = useQuery(event)

    if (typeof pointer === "string") {
        shouldSkip.skip = 1
        shouldSkip.cursor = {id: parseInt(pointer)}
    }

    // TODO: translate the disability, based on trans_name
    const comments = prisma.comment.findMany({
        take: amountOfComments,
        orderBy: {
          createdAt: 'desc'
        },
        ...shouldSkip,
        where: {authorId: userId, ...shouldPublic},
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
        }
    })

    return comments
})
