import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {IUser, UserModel} from "./model";

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret'

export const registerUser = async (
    email: string,
    password: string,
    role: 'Client' | 'Provider'
) => {
    const hashed = await bcrypt.hash(password, 10)
    const user = new UserModel({ email, password: hashed, role })
    await user.save()
    return user as IUser
}

export const authenticateUser = async (
    email: string,
    password: string
) => {
    const user = await UserModel.findOne({email}).then()
    if (!user) return null
    const match = await bcrypt.compare(password, user.password)
    if (!match) return null
    return user
}

export const generateTokens = (user: { _id: any, role: string }) => {
    const access =
        jwt.sign({id: user._id, role: user.role},
            JWT_SECRET,
            {expiresIn: '15m'})
    const refresh =
        jwt.sign({id: user._id},
            REFRESH_SECRET,
            {expiresIn: '7d'})
    return {access, refresh}
}

export const verifyAccessToken = (token: string) => jwt.verify(token, JWT_SECRET)
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET)