import {FastifyReply, FastifyRequest, preHandlerHookHandler} from 'fastify'
import {verifyAccessToken} from "./service";
export const authGuard: preHandlerHookHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({error: 'Unauthorized'})
        return
    }
    try {
        const token = authHeader.split(' ')[1];
        (request as any).user = verifyAccessToken(token)
    } catch (err) {
        reply.status(401).send({error: 'Invalid token'})
    }
}

export function roleGuard(requiredRole: 'Client' | 'Provider') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const user = (request as any).user
        if (!user || user.role !== requiredRole) {
            reply.status(403).send({error: 'Forbidden'})
        }
    }
}