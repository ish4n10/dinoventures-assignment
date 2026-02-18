
import { dbSource } from "./Database"
import { LedgerEntry } from "../models/LedgerEntry"

export const createLedgerEntry = async (data: { id: string, transactionId: string, walletId: string, amount: number, createTs: Date }): Promise<LedgerEntry> => {
  const entry = new LedgerEntry()
  entry.id = data.id
  entry.transactionId = data.transactionId
  entry.walletId = data.walletId
  entry.amount = data.amount
  entry.createTs = data.createTs
  return await dbSource.manager.save(entry)
}

export const getLedgerEntriesByWalletId = async (walletId: string): Promise<LedgerEntry[]> => {
  return await dbSource.getRepository(LedgerEntry).find({
    where: { walletId },
    order: { createTs: "DESC" }
  })
}
