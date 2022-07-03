import {createError, defineEventHandler, sendError, useBody} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

interface UpdateDisabilityPayload {
    disability: [number]
}

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    const userId = event.context.user.id

    const {disability} = await useBody<UpdateDisabilityPayload>(event)

    await prisma.userDisability.deleteMany({
        where: {
            userId,
            disabilityId: {
                notIn: disability
            }
        }
    })

    await prisma.userDisability.createMany({
        data: disability.map(did => {
            return {
                userId,
                disabilityId: did
            }
        }),
        skipDuplicates: true
    })

    return {
        success: true
    }
})
