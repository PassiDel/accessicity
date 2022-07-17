import {defineEventHandler} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const {slug} = event.context.params

    return await prisma.city.findUnique({
        where: {
            slug
        },
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
            west: true,
            ranking: {
                select: {
                    value: true,
                    disability: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            trans_name: true,
                            icon: true
                        }
                    }
                }
            }
        }
    })
})
