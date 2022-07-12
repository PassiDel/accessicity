import {defineEventHandler} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async () => {

    return await prisma.overallRanking.findMany({
        take: 5,
        orderBy: {
            value: 'desc'
        },
        select: {
            value: true,
            city: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    loc_lat: true,
                    loc_lon: true,
                    outline: true,
                    north: true,
                    east: true,
                    south: true,
                    west: true
                }
            }
        }
    })
})
