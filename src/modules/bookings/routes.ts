import {FastifyInstance} from 'fastify'
import {
    createBookingHandler,
    confirmBookingHandler,
    cancelBookingHandler
} from './controller'
import {authGuard, roleGuard} from "../auth/authGuard";

export default async function bookingRoutes(app: FastifyInstance) {
    app.addHook('onRequest', authGuard)

    app.post('/', {
            preHandler: async (request, reply) => {
                await roleGuard('Client')(request, reply)
            },
            schema: {
                tags: ['Bookings'],
                body: {
                    type: 'object',
                    required: ['serviceId', 'startTime'],
                    properties: {
                        serviceId: {type: 'string'},
                        startTime: {type: 'string', format: 'date-time'}
                    }
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            _id: {type: 'string'},
                            serviceId: {type: 'string'},
                            providerId: {type: 'string'},
                            clientId: {type: 'string'},
                            startTime: {type: 'string'},
                            endTime: {type: 'string'},
                            status: {type: 'string'}
                        }
                    }
                }
            }

        },
        createBookingHandler)

    app.patch('/:id/confirm', {
            preHandler: async (request, reply) => {
                await roleGuard('Provider')(request, reply)
            },
            schema: {
                tags: ['Bookings'],
                params: {
                    type: 'object',
                    properties: {
                        id: {type: 'string'}
                    }
                },
                response: {
                    200: {type: 'object'}
                }
            }

        },
        confirmBookingHandler
    )

    app.patch('/:id/cancel', {
            preHandler: async (request, reply) => {
                await roleGuard('Provider')(request, reply)
            },
            schema: {
                tags: ['Bookings'],
                params: {
                    type: 'object',
                    properties: {
                        id: {type: 'string'}
                    }
                },
                response: {
                    200: {type: 'object'}
                }
            }
        },
        cancelBookingHandler
    )
}
