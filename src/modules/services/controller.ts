import { FastifyRequest, FastifyReply } from 'fastify'
import { createService, getServicesByProvider } from './service'

export const createServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user
    const { name, description, duration, price } = req.body as any
    try {
        const newService = await createService({
            providerId: user.id,
            name,
            description,
            duration,
            price
        })
        reply.code(201).send(newService)
    } catch (err) {
        reply.code(400).send({ error: 'Service creation failed' })
    }
}

export const getMyServicesHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user
    const services = await getServicesByProvider(user.id)
    reply.send(services)
}