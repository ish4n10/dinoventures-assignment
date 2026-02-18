
import "reflect-metadata"
import { DataSource } from "typeorm"
import { SystemUser } from "../models/SystemUser"
import { AssetType } from "../models/AssetType"
import { Wallet } from "../models/Wallet"
import { LedgerEntry } from "../models/LedgerEntry"
import { User } from "../models/User"
import { TransactionRequest } from "../models/TransactionRequest"

export const dbSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [User, SystemUser, AssetType, Wallet, LedgerEntry, TransactionRequest],
    migrations: [],
    subscribers: [],
})
