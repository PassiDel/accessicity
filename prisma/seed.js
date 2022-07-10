const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', line => {

    const data = Object.entries(JSON.parse(line)).map(c => {
        const lat = c[1].coordinates[0][0].map(c => c[0])
        const lng = c[1].coordinates[0][0].map(c => c[1])
        const bb = {
            west: Math.min(...lat),
            east: Math.max(...lat),
            north: Math.max(...lng),
            south: Math.min(...lng)
        }

        return {
            name: c[0],
            slug: c[0].toLowerCase()
                .replace(/ü/g, 'ue')
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ß/g, 'ss')
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-'),
            outline: c[1],
            ...bb,
            loc_lat: (bb.north + bb.south) / 2,
            loc_lon: (bb.west + bb.east) / 2
        }
    })

    console.log(data.length)

    async function main() {
        const result = await prisma.$transaction([
            prisma.city.deleteMany({}),
            prisma.$queryRaw`ALTER TABLE City
                AUTO_INCREMENT = 1`,
            prisma.city.createMany({
                data,
                skipDuplicates: true
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

})
