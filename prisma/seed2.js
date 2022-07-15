const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


const rand = (min = 1, max = 5) => Math.floor(Math.random() * (max - min + 1) + min)

const comments = [...Array(100).keys()].map(i => {
    return {public: true, title: 'test', message: 'm', rating: rand(), authorId: 1, cityId: rand(1, 10000)}
})

async function main() {
    const result = await prisma.$transaction([
        prisma.user.deleteMany({}),
        prisma.$queryRaw`ALTER TABLE User
            AUTO_INCREMENT = 1`,
        prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@bosym.de',
                // secrettt
                password: '$argon2i$v=19$m=4096,t=3,p=1$ysfmBmKdGRIobckCuBWzWA$tftAYhZhhOwISlSGXS1wXBA7RE4qETEkC/LJBGsk0fc',
                role: 'ADMIN'
            }
        }),
        prisma.comment.deleteMany({}),
        prisma.$queryRaw`ALTER TABLE Comment
            AUTO_INCREMENT = 1`,
        prisma.comment.createMany({data: comments})
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
