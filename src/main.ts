import Fastify from 'fastify'
import dotenv from 'dotenv'

import authRoutes from './modules/auth/routes'
import serviceRoutes from './modules/services/routes'
import {connectDB} from './core/db'
import {setupRedis} from './core/redis'
import {setupQueue} from './core/queue'
import {registerPlugins} from './core/plugins'
import bookingRoutes from "./modules/bookings/routes";

dotenv.config()


const start = async () => {
    const app = Fastify({logger: true})

// Плагіни: jwt, swagger, rate limit тощо
    await registerPlugins(app)

// Маршрути
    app.register(authRoutes, {prefix: '/auth'})
    app.register(serviceRoutes, {prefix: '/services'})
    app.register(bookingRoutes, {prefix: '/bookings'})
    try {
        await connectDB()
        await setupRedis()
        await setupQueue()
        await app.listen({port: Number(process.env.PORT) || 3000, host: '0.0.0.0'})
        console.log('🚀 Server is running')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()
