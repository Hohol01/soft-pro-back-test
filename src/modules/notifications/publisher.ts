import { notificationQueue } from '../../core/queue'

export const sendNotification = async (type: 'booked' | 'confirmed' | 'cancelled', payload: any) => {
    await notificationQueue.add('notify', { type, payload })
    console.log('📨 Notification enqueued:', type)
}