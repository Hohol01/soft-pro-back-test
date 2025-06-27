import {FastifyInstance} from 'fastify'
import {createServiceHandler, getMyServicesHandler} from './controller'
import {authGuard, roleGuard} from "../auth/authGuard";

export default async function serviceRoutes(app: FastifyInstance) {
    app.addHook('onRequest', authGuard)

    app.post('/', {
            preHandler: async (request, reply) => {
                await roleGuard('Provider')(request, reply)
            },
            schema: {
                tags: ['Services'],
                body: {
                    type: 'object',
                    required: ['name', 'duration', 'price'],
                    properties: {
                        name: {type: 'string'},
                        description: {type: 'string'},
                        duration: {type: 'integer', minimum: 1},
                        price: {type: 'number', minimum: 0}
                    }
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            _id: {type: 'string'},
                            name: {type: 'string'},
                            description: {type: 'string'},
                            duration: {type: 'number'},
                            price: {type: 'number'},
                            providerId: {type: 'string'}
                        }
                    }
                }
            }
        },
        createServiceHandler
    )

    app.get('/', {
            preHandler: async (request, reply) => {
                await roleGuard('Provider')(request, reply)
            },
            schema: {
                tags: ['Services'],
                response: {
                    200: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                _id: {type: 'string'},
                                name: {type: 'string'},
                                description: {type: 'string'},
                                duration: {type: 'number'},
                                price: {type: 'number'},
                                providerId: {type: 'string'}
                            }
                        }
                    }
                }
            }
        },
        getMyServicesHandler
    )
}
