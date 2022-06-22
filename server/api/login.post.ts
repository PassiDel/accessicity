import {PrismaClient} from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import {sendError, createError, useBody, defineEventHandler} from "h3";

const prisma = new PrismaClient()

type LoginPayload = { email: string, password: string };
export default defineEventHandler(async (event) => {
    // no login if the user is already authenticated
    if (event.context.user)
        return sendError(event, createError({statusCode: 409, statusMessage: 'Conflict'}))


    const { email, password } = await useBody<LoginPayload>(event);

    // TODO: maybe add input sanitization?

    const user = await prisma.user.findUnique({where: {email}})

    // check if user exists and verify the password hashes
    if (!user || !await argon2.verify(user.password, password)) {
        return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthenticated'}))
    }

    // sign a jwt for this user account
    const token = jwt.sign({
        userId: user.id,
        name: user.name,
        email: user.email,
    }, process.env.JWT_SECRET);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
    };
})
