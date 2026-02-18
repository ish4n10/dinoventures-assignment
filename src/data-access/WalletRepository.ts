
import { dbSource } from "./Database"
import { Wallet } from "../models/Wallet"
import { LedgerEntry } from "../models/LedgerEntry"

export const createWallet = async (data: { id: string, ownerType: string, ownerId: string, assetId: string, createTs: Date, updateTs: Date }): Promise<Wallet> => {
    const wallet = new Wallet()
    wallet.id = data.id
    wallet.ownerType = data.ownerType
    wallet.ownerId = data.ownerId
    wallet.assetId = data.assetId
    wallet.createTs = data.createTs
    return await dbSource.manager.save(wallet)
}

export const getWalletById = async (id: string): Promise<Wallet | null> => {
    return await dbSource.getRepository(Wallet).findOneBy({ id })
}

export const getWalletsByOwnerId = async (ownerId: string, ownerType: string): Promise<Wallet[]> => {
    return await dbSource.getRepository(Wallet).findBy({ ownerId, ownerType })
}

export const getWalletBalanceById = async (walletId: string): Promise<number> => {
    const balanceRow = await dbSource
        .createQueryBuilder(LedgerEntry, "l")
        .select("COALESCE(SUM(l.amount), 0)", "balance")
        .where("l.walletId = :id", { id: walletId })
        .getRawOne();

    return Number(balanceRow.balance);
};