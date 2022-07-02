import {createError, defineEventHandler, sendError, useBody} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

type DisabilityRating = {
    id: number,
    rating: number
};

interface AddCommentPayload {
    title: string,
    message: string,
    rating: number,
    disability?: [
        DisabilityRating
    ]
}

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    // TODO: Add feature: add a new comment to a city

    const userId = event.context.user.id;
    const cityId = parseInt(event.context.params.id)
    // TODO: add input validation

    const {title, message, rating, disability} = await useBody<AddCommentPayload>(event)
    return await prisma.comment.create({
        data: {
            cityId,
            authorId: userId,
            title,
            message,
            rating,
            disability: {
                create: disability.map(d => {
                    return {
                        rating: d.rating,
                        disabilityId: d.id
                    }
                })
            }
        }
    })

})
