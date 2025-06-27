import {Schema, model, InferSchemaType, Model} from 'mongoose'

const serviceSchema = new Schema({
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true }, // in minutes
    price: { type: Number, required: true }
}, { timestamps: true })

export type IService = InferSchemaType<typeof serviceSchema>
export const ServiceModel: Model<IService> = model('Service', serviceSchema)
