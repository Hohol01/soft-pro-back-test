import {BookingModel, IBooking} from '../src/modules/bookings/model';
import { redisClient } from '../src/core/redis';
import {IService, ServiceModel} from '../src/modules/services/model';

interface AvailableSlot {
    serviceId: string;
    from: string;
    to: string;
}

export const getAvailability = async (providerId: string, date: string): Promise<AvailableSlot[]> => {
    const cacheKey = `availability:${providerId}:${date}`;

    // Проверка кэша
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) return JSON.parse(cached.toString());
    } catch (e) {
        console.error('Redis error:', e);
    }

    // Получение услуг провайдера
    const services: IService = await ServiceModel.find({ providerId }).lean();
    if (!services.length) return [];

    // Получение бронирований
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    const bookings: IBooking = await BookingModel.find({
        providerId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' }
    }).select('startTime endTime').lean();

    // Подготовка данных
    const bookedIntervals = bookings.map(b => [
        b.startTime.getTime(),
        b.endTime.getTime()
    ]);

    const availableSlots: AvailableSlot[] = [];

    // Генерация доступных слотов
    for (const service of services) {
        const openHour = 8;
        const closeHour = 18;
        const slotDurationMs = service.duration * 60 * 1000;

        const dayStart = new Date(startOfDay);
        dayStart.setHours(openHour, 0, 0, 0);

        const dayEnd = new Date(startOfDay);
        dayEnd.setHours(closeHour, 0, 0, 0);

        for (let t = dayStart.getTime(); t + slotDurationMs <= dayEnd.getTime(); t += slotDurationMs) {
            const slotEnd = t + slotDurationMs;
            const isAvailable = !bookedIntervals.some(
                ([start, end]) => t < end && slotEnd > start
            );

            if (isAvailable) {
                availableSlots.push({
                    serviceId: service._id.toString(),
                    from: new Date(t).toISOString(),
                    to: new Date(slotEnd).toISOString()
                });
            }
        }
    }

    // Кэширование
    try {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(availableSlots));
    } catch (e) {
        console.error('Redis cache set error:', e);
    }

    return availableSlots;
};