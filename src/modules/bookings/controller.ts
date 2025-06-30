import { FastifyRequest, FastifyReply } from 'fastify'
import { createBooking, updateBookingStatus } from './service'
import {sendBookingReminder, sendNotification} from "../notifications/publisher";
import {IBooking} from "./model";

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
    const booking: IBooking| null = await updateBookingStatus((req.params as any).id, 'confirmed')
    if (!booking) {
        return reply.status(404).send({ error: 'Booking not found' })
    }
    await sendNotification('confirmed', booking);
    await sendBookingReminder( (req as any).user, booking)
    reply.send(booking)
}

export const cancelBookingHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const booking = await updateBookingStatus((req.params as any).id, 'cancelled')
    await sendNotification('cancelled', booking);
    reply.send(booking)
}