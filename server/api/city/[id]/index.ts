import {defineEventHandler} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const cityId = event.context.params.id

    return await prisma.city.findUnique({
        where: {slug: cityId},
        select: {
            id: true,
            name: true,
            slug: true,
            loc_lat: true,
            loc_lon: true,
            outline: true,
            loc_zoom: true,
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
