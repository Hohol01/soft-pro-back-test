import {FastifyRequest, FastifyReply} from 'fastify'
import {registerUser, authenticateUser, generateTokens, verifyRefreshToken} from './service'

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const {email, password, role} = request.body as any
    try {
        const user = await registerUser(email, password, role)
        const tokens = generateTokens(user)
        reply.send({user: {email: user.email, role: user.role}, ...tokens})
    } catch (err) {
        reply.status(400).send({error: 'Registration failed'})
    }
}

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const {email, password} = request.body as any
    const user = await authenticateUser(email, password)
    if (!user) return reply.status(401).send({error: 'Invalid credentials'})
    const tokens = generateTokens(user)
    reply.send({user: {email: user.email, role: user.role}, ...tokens})
}

export const refreshTokenHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const {refresh} = request.body as { refresh: string }
    try {
        const payload = verifyRefreshToken(refresh) as any
        const tokens = generateTokens({_id: payload.id, role: payload.role || 'Client'})
        reply.send({access: tokens.access})
    } catch (err) {
        reply.status(401).send({error: 'Invalid refresh token'})
    }
}