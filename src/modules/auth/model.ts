import {Schema, model, Model, InferSchemaType} from 'mongoose'

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Client', 'Provider'], required: true },
}, { timestamps: true })

export type IUser = InferSchemaType<typeof userSchema>
export const UserModel: Model<IUser> = model('User', userSchema)
