import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
})

export let notificationQueue: Queue

export const setupQueue = async () => {
    notificationQueue = new Queue('notifications', { connection })

     new Worker('notifications', async (job) => {
        console.log('📨 Simulated email:', job.data)
    }, { connection })

    console.log('✅ Queue initialized')
}
