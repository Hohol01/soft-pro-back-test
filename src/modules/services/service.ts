import { ServiceModel } from './model'
export const createService = async (data: {
    providerId: string,
    name: string,
    description?: string,
    duration: number,
    price: number
}) => {
    const service = new ServiceModel(data)
    return await service.save()
}

export const getServicesByProvider = async (providerId: string) => {
    return ServiceModel.find({providerId});
}

