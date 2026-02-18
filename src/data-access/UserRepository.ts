
import { EntityManager } from "typeorm"
import { dbSource } from "./Database"
import { User } from "../models/User"

export const createUserWithManager = async (manager: EntityManager, data: { id: string, name: string, createTs: Date }): Promise<User> => {
    const user = new User()
    user.id = data.id
    user.name = data.name
    user.createTs = data.createTs
    return await manager.save(user)
}

export const createUser = async (data: { id: string, name: string, createTs: Date }): Promise<User> => {
    const user = new User()
    user.id = data.id
    user.name = data.name
    user.createTs = data.createTs
    return await dbSource.manager.save(user)
}

export const getUserById = async (id: string): Promise<User | null> => {
    return await dbSource.getRepository(User).findOneBy({ id })
}

export const getUserList = async (): Promise<Array<User>> => {
    return await dbSource.getRepository(User).find()
}

export const updateUser = async (data: { id: string, name: string, updateTs: Date }): Promise<User> => {
    let user = await dbSource.getRepository(User).findOneBy({ id: data.id })
    if (user) {
        user.name = data.name
        return await dbSource.manager.save(user)
    }
    throw new Error("User not found")
}
