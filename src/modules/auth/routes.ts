import {registerHandler, loginHandler, refreshTokenHandler} from './controller'
import {FastifyInstance} from 'fastify'

export default async function authRoutes(app: FastifyInstance) {
    app.post('/register', {
            schema: {
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['email', 'password', 'role'],
                    properties: {
                        email: {type: 'string', format: 'email'},
                        password: {type: 'string', minLength: 6},
                        role: {type: 'string', enum: ['Client', 'Provider']}
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            user: {
                                type: 'object',
                                properties: {
                                    email: {type: 'string'},
                                    role: {type: 'string'}
                                }
                            },
                            access: {type: 'string'},
                            refresh: {type: 'string'}
                        }
                    }
                }
            }
        },
        registerHandler)

    app.post('/login', {
            schema: {
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {type: 'string', format: 'email'},
                        password: {type: 'string'}
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            user: {
                                type: 'object',
                                properties: {
                                    email: {type: 'string'},
                                    role: {type: 'string'}
                                }
                            },
                            access: {type: 'string'},
                            refresh: {type: 'string'}
                        }
                    }
                }
            }

        },
        loginHandler
    )
    app.post('/refresh', {
            schema: {
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['refresh'],
                    properties: {
                        refresh: {type: 'string'}
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            access: {type: 'string'}
                        }
                    }
                }
            },
        },
        refreshTokenHandler
    )
}
