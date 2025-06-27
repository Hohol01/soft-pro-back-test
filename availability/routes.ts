import {FastifyInstance} from 'fastify'
import {availabilityHandler} from './controller'

export default async function availabilityRoutes(app: FastifyInstance) {
    app.get('/', {
            schema: {
                tags: ['Availability'],
                querystring: {
                    type: 'object',
                    required: ['providerId', 'date'],
                    properties: {
                        providerId: {type: 'string'},
                        date: {type: 'string', format: 'date'}
                    }
                },
                response: {
                    200: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                serviceId: {type: 'string'},
                                from: {type: 'string'},
                                to: {type: 'string'}
                            }
                        }
                    }
                }
            }

        },
        availabilityHandler
    )
}