import {defineEventHandler, useQuery} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // TODO: add pagination
    const {page, sortBy, dir}: {
        page?: string,
        sortBy?: string,
        dir?: 'asc' | 'desc'
    } = useQuery(event)

    const rankings = sortBy && sortBy !== '0' ? (await prisma.ranking.findMany({
            take: 10,
            orderBy: {
                value: dir ?? 'desc'
            },
            where: {
                disabilityId: parseInt(sortBy)
            },
            select: {
                value: true,
                basedOn: true,
                city: {
                    select: {
                        name: true,
                        slug: true,
                        ranking: {
                            select: {
                                value: true,
                                basedOn: true,
                                disability: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        },
                        overallRanking: {
                            select: {
                                value: true,
                                basedOn: true
                            }
                        }
                    }
                }
            }
        })).map(r => {
            r.value = r.city.overallRanking[0].value
            r.basedOn = r.city.overallRanking[0].basedOn
            delete r.city.overallRanking
            return r
        }) :
        await prisma.overallRanking.findMany({
            take: 10,
            orderBy: {
                value: dir ?? 'desc'
            },
            select: {
                value: true,
                basedOn: true,
                city: {
                    select: {
                        name: true,
                        slug: true,
                        ranking: {
                            select: {
                                value: true,
                                basedOn: true,
                                disability: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

    const disabilities = await prisma.disability.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            trans_name: true,
            icon: true
        }
    })

    return {
        disabilities,
        rankings
    }
})
