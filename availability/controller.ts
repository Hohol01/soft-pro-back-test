import { FastifyRequest, FastifyReply } from 'fastify'
import { getAvailability } from './service'

export const availabilityHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { providerId, date } = req.query as any
    try {
        const slots = await getAvailability(providerId, date)
        reply.send(slots)
    } catch (err) {
        reply.code(400).send({ error: 'Unable to fetch availability' })
    }
}