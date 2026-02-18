
import { dbSource } from "./Database"
import { SystemUser } from "../models/SystemUser"

export const createSystemUser = async (data: { id: string, name: string, createTs: Date }): Promise<SystemUser> => {
  const user = new SystemUser()
  user.id = data.id
  user.name = data.name
  user.createTs = data.createTs
  return await dbSource.manager.save(user)
}

export const getSystemUserById = async (id: string): Promise<SystemUser | null> => {
  return await dbSource.getRepository(SystemUser).findOneBy({ id })
}
