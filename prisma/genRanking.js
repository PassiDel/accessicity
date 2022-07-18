const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

    // calculate overall ratings
    const cityOverallRating = (await prisma.comment.groupBy({
        by: ['cityId'],
        _count: {
            _all: true
        },
        _sum: {
            rating: true
        }
    })).map(c => {
        return {
            cityId: c.cityId,
            value: c._sum.rating / c._count._all,
            basedOn: c._count._all
        }
    });

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
            value: c.rating,
            basedOn: c.count
        }
    })).flat(1)

    const result = await prisma.$transaction([
        prisma.ranking.deleteMany(),
        // prisma.$queryRaw`ALTER TABLE Ranking AUTO_INCREMENT = 1`,
        prisma.ranking.createMany({
            data: creates
        }),
        prisma.overallRanking.deleteMany(),
        prisma.overallRanking.createMany({
            data: cityOverallRating
        })
    ])

    console.log(result)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
