import {PrismaClient} from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import {sendError, createError, useBody, defineEventHandler} from "h3";

const prisma = new PrismaClient()

type RegisterPayload = {
    email: string,
    password: string,
    name: string
};
export default defineEventHandler(async (event) => {
    // no login if the user is already authenticated
    if (event.context.user)
        return sendError(event, createError({statusCode: 409, statusMessage: 'Conflict'}))

    const { email, password, name } = await useBody<RegisterPayload>(event);

    // TODO: maybe add input sanitization?

    const existingUser = await prisma.user.findUnique({where: {email}})

    if (existingUser){
        return sendError(event, createError({statusCode: 409, statusMessage: 'Conflict - User already exists'}))
    }

    const passwordHash = await argon2.hash(password)

    const user = await prisma.user.create({ data: {
            name,
            password: passwordHash,
            email
        }})

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
