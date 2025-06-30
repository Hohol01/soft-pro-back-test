import fastifyJwt from 'fastify-jwt'
import { FastifyInstance } from 'fastify'
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

export const registerPlugins = async (app: FastifyInstance) => {
    await app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'secret' })

    await app.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'Test API',
                description: 'Testing swagger docs',
                version: '1.0.0'
            },
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                BearerAuth: {
                    type: 'apiKey',
                    name: 'authorization',
                    in: 'header',
                    description: 'Enter token as: Bearer <token>'
                }
            },
            security: [{ BearerAuth: [] }]

        }
    });

    await app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
    });

    await app.register(fastifyRateLimit, {
        max: 100,
        timeWindow: '1 minute'
    })
}