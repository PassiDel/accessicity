import {defineEventHandler} from "h3";
import jwt, {JwtPayload} from 'jsonwebtoken'

interface JwtUserPayload extends JwtPayload{
    userId: number,
    name: string,
    email: string
}

export default defineEventHandler((event) => {
    const authHeaderMatch = /^Bearer (?<token>.*?)$/.exec(event.req.headers['authorization']);
    const token = authHeaderMatch?.groups.token;


    if (!token)
        return

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtUserPayload

        if (!payload || !payload.userId || !payload.name || !payload.email)
            return

        event.context.user = {
            id: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role ? payload.role : 'USER'
        }

    } catch (err) {
        return
    }
})


declare module 'h3' {
    interface H3EventContext extends Record<string, any> {
        user?: {
            id: number
            name: string
            email: string
        }
    }
}
