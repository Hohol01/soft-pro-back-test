import {BookingModel} from './model'
import {IService, ServiceModel} from '../services/model'

export const createBooking = async (data: {
    serviceId: string
    clientId: string
    startTime: Date
}) => {
    const service: IService = await ServiceModel.findById(data.serviceId)
    if (!service) throw new Error('Service not found')

    const endTime = new Date(new Date(data.startTime).getTime() + service.duration * 60000)

    const conflict = await BookingModel.findOne({
        providerId: service.providerId,
        startTime: {$lt: endTime},
        endTime: {$gt: data.startTime},
        status: {$ne: 'cancelled'}
    })
    if (conflict) throw new Error('Time slot is already booked')

    const booking = new BookingModel({
        serviceId: service._id,
        providerId: service.providerId,
        clientId: data.clientId,
        startTime: data.startTime,
        endTime
    })

    return await booking.save()
}

export const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {

    return await BookingModel.findByIdAndUpdate(id, {status}, {new: true})
}
