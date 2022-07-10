import {defineEventHandler, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

interface CitiesQuery {
    page?: string,
    min_lat?: string
    max_lat?: string,
    min_lon?: string,
    max_lon?: string
}

export default defineEventHandler(async (event) => {

    // TODO: outsourcing in global
    const amountOfCities = 10;
    const {page = "1", min_lat, max_lat, min_lon, max_lon}: CitiesQuery = useQuery(event)

    let outline = false
    let where = {}
    let skip = undefined
    let take = undefined
    let pagination = {}

    if (
        min_lat &&
        max_lat &&
        min_lon &&
        max_lon
    ) {
        outline = true

        where = {
            loc_lat: {gte: min_lat, lte: max_lat},
            loc_lon: {gte: min_lon, lte: max_lon}
        }
    } else {
        skip = typeof page === "string" ? (parseInt(page) - 1) * amountOfCities : 0

        const count = await prisma.city.count({
            where: {},
        })

        pagination = {
            pagination: {
                offset: skip,
                limit: amountOfCities,
                total: count,
                lastPage: Math.ceil(count / amountOfCities)
            }
        }
    }

    const cities = await prisma.city.findMany({
        skip,
        take,
        where,
        select: {
            id: true,
            name: true,
            loc_lat: true,
            loc_lon: true,
            north: true,
            east: true,
            south: true,
            west: true,
            outline,
        },
        orderBy: {
            id: 'asc'
        },
    })

    return {
        data: cities,
        ...pagination
    }
})
