import { notificationQueue } from '../../core/queue'
import {IBooking} from "../bookings/model";
import {IUser} from "../auth/model";

export const sendNotification = async (type: 'booked' | 'confirmed' | 'cancelled', payload: any) => {
    await notificationQueue.add('notify', { type, payload })
}
export const sendBookingReminder =async(client:IUser, booking: IBooking) => {
await notificationQueue.add(
    'booking-reminder',
    {
        to: client.email,
        bookingId: booking._id,
        startTime: booking.startTime
    },
    {
        delay: new Date(booking.startTime).getTime() - Date.now() - 60 * 60 * 1000,
        attempts: 3
    })
}