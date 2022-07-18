const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const disabilityCount = 6
const titles = [
    'Interesting City',
    'Special needs? More like special gots!',
    'Horrible',
    'Weird',
    'Its okay'
]

const messages = [
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    'Eros adversarium vel ut. Ius oporteat dignissim ex, quo et constituam dissentiunt.',
    'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates',
    'According to all known laws of aviation, there is no way a bee should be able to fly.\n' +
    'Its wings are too small to get its fat little body off the ground.\n' +
    'The bee, of course, flies anyway because bees don\'t care what humans think is impossible.\n' +
    'Yellow, black. Yellow, black. Yellow, black. Yellow, black.',
    'No, I\'m not going.\n' +
    'Everybody knows, sting someone, you die.\n' +
    'Don\'t waste it on a squirrel.\n' +
    'Such a hothead.',
    'Well, hello.\n' +
    'Ken!\n' +
    'Hello.\n' +
    'I didn\'t think you were coming.\n' +
    'No, I was just late I tried to call, but... the battery.\n' +
    'I didn\'t want all this to go to waste,\n' +
    'so I called Barry. Luckily, he was free.\n' +
    'Oh, that was lucky.',
    'Remember what Van said, why is your life more valuable than mine?\n' +
    'Funny, I just can\'t seem to recall that! I think something stinks in here!\n' +
    'I love the smell of flowers.\n' +
    'How do you like the smell of flames?!'
]

const rand = (min = 1, max = 5) => Math.floor(Math.random() * (max - min + 1) + min)

const comments = [...Array(100000).keys()].map(() => ({
    public: true,
    title: titles[rand(0, titles.length - 1)],
    message: messages[rand(0, messages.length - 1)],
    rating: rand(),
    authorId: rand(1, 4),
    cityId: rand(1, 10000)
}))

const commentDisabilities = comments.map((_, ii) => ([...Array(rand(1, disabilityCount)).keys()].map(i => ({
    disabilityId: rand(1, disabilityCount),
    commentId: ii + 1,
    rating: rand()
})))).flat()

const commentDisabilitiesUniq = [...new Map(commentDisabilities.map(item => [`${item.commentId}-${item.disabilityId}`, item])).values()]


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
                role: 'ADMIN',
                disabilitys: {
                    createMany: {
                        data: [
                            {disabilityId: 3, createdAt: new Date(), verified: true},
                            {disabilityId: 5, createdAt: new Date(), verified: true},
                            {disabilityId: 6, createdAt: new Date(), verified: false},
                        ]
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                name: 'Pascal',
                email: 'pascal@bosym.de',
                // secrettt
                password: '$argon2i$v=19$m=4096,t=3,p=1$ysfmBmKdGRIobckCuBWzWA$tftAYhZhhOwISlSGXS1wXBA7RE4qETEkC/LJBGsk0fc',
                role: 'ADMIN',
                disabilitys: {
                    createMany: {
                        data: [
                            {disabilityId: 2, createdAt: new Date(), verified: true},
                            {disabilityId: 5, createdAt: new Date(), verified: true},
                            {disabilityId: 6, createdAt: new Date(), verified: false},
                        ]
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                name: 'Adrian',
                email: 'adrian@bosym.de',
                // secrettt
                password: '$argon2i$v=19$m=4096,t=3,p=1$ysfmBmKdGRIobckCuBWzWA$tftAYhZhhOwISlSGXS1wXBA7RE4qETEkC/LJBGsk0fc',
                role: 'USER',
                disabilitys: {
                    createMany: {
                        data: [
                            {disabilityId: 1, createdAt: new Date(), verified: true},
                            {disabilityId: 2, createdAt: new Date(), verified: true},
                            {disabilityId: 4, createdAt: new Date(), verified: false},
                        ]
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                name: 'John',
                email: 'john@bosym.de',
                // secrettt
                password: '$argon2i$v=19$m=4096,t=3,p=1$ysfmBmKdGRIobckCuBWzWA$tftAYhZhhOwISlSGXS1wXBA7RE4qETEkC/LJBGsk0fc',
                role: 'USER',
                disabilitys: {
                    createMany: {
                        data: [
                            {disabilityId: 1, createdAt: new Date(), verified: true},
                            {disabilityId: 2, createdAt: new Date(), verified: true},
                            {disabilityId: 3, createdAt: new Date(), verified: true},
                            {disabilityId: 4, createdAt: new Date(), verified: true},
                            {disabilityId: 6, createdAt: new Date(), verified: true},
                        ]
                    }
                }
            }
        }),
        prisma.comment.deleteMany({}),
        prisma.$queryRaw`ALTER TABLE Comment
            AUTO_INCREMENT = 1`,
        prisma.comment.createMany({data: comments}),
        prisma.commentDisablilty.createMany({data: commentDisabilitiesUniq})
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
