import {HydratedDocument, InferSchemaType, Model, model, Schema} from "mongoose";

enum Status {
    pending, confirmed, cancelled
}

const bookingSchema = new Schema({
    serviceId: {type: Schema.Types.ObjectId, ref: 'Service', required: true},
    providerId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    clientId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    status: {type: String, enum: Object.values(Status), default: Status.pending}
}, {timestamps: true})




type BookingSchemaType = InferSchemaType<typeof bookingSchema>
export type IBooking = HydratedDocument<BookingSchemaType>
export const BookingModel: Model<BookingSchemaType> = model('Booking', bookingSchema)
