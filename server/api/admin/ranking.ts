import {createError, defineEventHandler, sendError} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (!event.context.user || event.context.user.role !== 'ADMIN')
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    // calculate overall ratings
    // const cityRating = (await prisma.comment.groupBy({
    //     by: ['cityId'],
    //     _count: {
    //         _all: true
    //     },
    //     _sum: {
    //         rating: true
    //     }
    // })).map(c => {
    //     return {
    //         id: c.cityId,
    //         rating: c._sum.rating / c._count._all
    //     }
    // });
    const cityRating = (await prisma.commentDisablilty.findMany({
        select: {
            comment: {
                select: {
                    cityId: true
                }
            },
            rating: true,
            disabilityId: true
        }
    }));
    const ratings = []
    // group by disability, group by city, sum/count ratings
    cityRating.forEach(r => {
        const {rating, disabilityId} = r
        const cityId = r.comment.cityId

        const dIndex = ratings.findIndex(p => p.disabilityId === disabilityId)
        if (dIndex === -1) {
            ratings.push({
                disabilityId,
                cities: [{
                    cityId,
                    sum: rating,
                    count: 1
                }]
            })
            return
        }

        const cIndex = ratings[dIndex].cities.findIndex(p => p.cityId === cityId)
        if (cIndex === -1) {
            ratings[dIndex].cities.push({
                cityId,
                sum: rating,
                count: 1
            })
            return
        }
        ratings[dIndex].cities[cIndex].sum += rating
        ratings[dIndex].cities[cIndex].count += 1
    })

    ratings.forEach(r => {
        r.cities.forEach(c => {
            c.rating = c.sum / c.count
        })
    })

    const creates = ratings.map(d => d.cities.map(c => {
        return {
            disabilityId: d.disabilityId,
            cityId: c.cityId,
            value: c.rating
        }
    })).flat(1)

    return await prisma.$transaction([
        prisma.ranking.deleteMany(),
        // prisma.$queryRaw`ALTER TABLE Ranking AUTO_INCREMENT = 1`,
        prisma.ranking.createMany({
            data: creates
        })
    ])
})
