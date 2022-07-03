import {createError, defineEventHandler, sendError, useBody} from "h3";
import {PrismaClient} from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient()

interface UpdatePayload {
    name?: string
    password?: string
}

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        return sendError(event, createError({statusCode: 403, statusMessage: 'Forbidden'}))

    const userId = event.context.user.id

    let {name, password} = await useBody<UpdatePayload>(event)

    if (password)
        password = await argon2.hash(password)

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            password
        }
    })

    return {
        success: true
    }
})
