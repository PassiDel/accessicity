import {defineEventHandler} from "h3";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async () => {

    return await prisma.disability.findMany()
})
