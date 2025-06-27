import {createClient, RedisClientType} from 'redis'

export let redisClient: RedisClientType

export const setupRedis = async () => {
    redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
    redisClient.on('error', (err) => console.error('Redis Error:', err))
    await redisClient.connect()
    console.log('✅ Redis connected')
}
