import {Schema, model, Model, InferSchemaType, HydratedDocument} from 'mongoose'

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Client', 'Provider'], required: true },
}, { timestamps: true })

type UserSchemaType = InferSchemaType<typeof userSchema>
export type IUser = HydratedDocument<UserSchemaType>
export const UserModel: Model<UserSchemaType> = model('User', userSchema)
