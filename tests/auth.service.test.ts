import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import {authenticateUser, registerUser} from "../src/modules/auth/service";

let mongoServer: MongoMemoryServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('AuthService', () => {
    it('реєструє користувача з хешованим паролем', async () => {
        const user = await registerUser('test@mail.com', 'pass1234', 'Client')
        expect(user.email).toBe('test@mail.com')
        expect(user.password).not.toBe('pass1234') // має бути хешований
    })

    it('авторизує користувача з вірним паролем', async () => {
        const user = await authenticateUser('test@mail.com', 'pass1234')
        expect(user).toBeTruthy()
        expect(user?.email).toBe('test@mail.com')
    })
})
