import { dbSource } from "../data-access/Database";
import { SystemUser } from "../models/SystemUser";
import { Wallet } from "../models/Wallet";


const getSystemWallet = async () => {
    const systemUser = await dbSource.getRepository(SystemUser).findOneBy({ id: "system" })
    if (!systemUser) {
        throw new Error("System user not found")
    }
    const systemWallet = await dbSource.getRepository(Wallet).findOneBy({ ownerId: systemUser.id })
    if (!systemWallet) {
        throw new Error("System wallet not found")
    }
    return systemWallet
}

export { getSystemWallet }