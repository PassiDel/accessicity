import {createError, defineEventHandler, sendError, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    const amountOfRankings = 10;
    const disabilityId = parseInt(event.context.params.id)

    const {page = "1"} = useQuery(event)

    const skip = typeof page === "string" ? (parseInt(page) - 1) * amountOfRankings : 0

    const rankings = await prisma.ranking.findMany({
        skip,
        take: amountOfRankings,
        where: {
            disabilityId
        },
        orderBy: {
            value: 'desc'
        },
        select: {
            city: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            value: true,
        }
    })

    const count = await prisma.ranking.count({
        where: {
            disabilityId
        },
    })

    return {
        data: rankings,
        pagination: {
            offset: skip,
            limit: amountOfRankings,
            total: count,
            lastPage: Math.ceil(count / amountOfRankings)
        }
    }
})
