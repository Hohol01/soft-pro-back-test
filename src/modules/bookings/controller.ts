import { FastifyRequest, FastifyReply } from 'fastify'
import { createBooking, updateBookingStatus } from './service'

export const createBookingHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user
    const { serviceId, startTime } = req.body as any
    try {
        const booking = await createBooking({
            serviceId,
            clientId: user.id,
            startTime: new Date(startTime)
        })
        reply.code(201).send(booking)
    } catch (err) {
        reply.code(400).send({ error: (err as any).message })
    }
}

export const confirmBookingHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const booking = await updateBookingStatus((req.params as any).id, 'confirmed')
    reply.send(booking)
}

export const cancelBookingHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const booking = await updateBookingStatus((req.params as any).id, 'cancelled')
    reply.send(booking)
}