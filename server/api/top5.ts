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
                    west: true,
                    comments: {
                        take: 5,
                        orderBy: {
                            createdAt: 'desc'
                        },
                        where: {
                            public: true
                        },
                        select: {
                            id: true,
                            createdAt: true,
                            title: true,
                            message: true,
                            rating: true,
                            author: {
                                select: {
                                    id: true,
                                    name: true,
                                    createdAt: true,
                                    disabilitys: {
                                        select: {
                                            verified: true,
                                            createdAt: true,
                                            disability: {
                                                select: {
                                                    id: true,
                                                    slug: true,
                                                    icon: true,
                                                }
                                            }
                                        },
                                        orderBy: {
                                            verified: 'desc'
                                        }
                                    }
                                }
                            },
                            disability: {
                                select: {
                                    rating: true,
                                    disability: {
                                        select: {
                                            id: true,
                                            slug: true,
                                            icon: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
})
