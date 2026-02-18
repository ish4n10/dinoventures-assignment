import { EntityManager, In } from "typeorm";
import { dbSource } from "../data-access/Database";
import { Wallet } from "../models/Wallet";
import { LedgerEntry } from "../models/LedgerEntry";
import { TransactionRequest } from "../models/TransactionRequest";
import { ExecuteTransactionInput } from "../types/transaction/Request";
import { v4 as uuidv4 } from "uuid";

const isNewTransaction = async (manager: EntityManager, transactionId: string): Promise<boolean> => {
    try {
        await manager.insert(TransactionRequest, {
            id: transactionId,
            transactionId: transactionId,
            createTs: new Date()
        });
        return true;
    } catch (error) {
        return false;
    }
};

const lockWallets = async (manager: EntityManager, walletIds: string[]) => {
    const sortedIds = [...walletIds].sort();

    await manager.find(Wallet, {
        where: { id: In(sortedIds) },
        lock: { mode: "pessimistic_write" }
    });
};

const getWalletBalanceById = async (manager: EntityManager, walletId: string): Promise<number> => {
    const balanceRow = await manager
        .createQueryBuilder(LedgerEntry, "l")
        .select("COALESCE(SUM(l.amount), 0)", "balance")
        .where("l.walletId = :id", { id: walletId })
        .getRawOne();

    return Number(balanceRow.balance);
};

const writeLedgerEntries = async (
    manager: EntityManager,
    transactionId: string,
    fromWalletId: string,
    toWalletId: string,
    amount: number
) => {
    const debitEntry = manager.create(LedgerEntry, {
        id: uuidv4(),
        transactionId,
        walletId: fromWalletId,
        amount: -amount,
        createTs: new Date()
    });

    const creditEntry = manager.create(LedgerEntry, {
        id: uuidv4(),
        transactionId,
        walletId: toWalletId,
        amount: amount,
        createTs: new Date()
    });

    await manager.save([debitEntry, creditEntry]);
    return creditEntry
};


export const executeTransactionWithManager = async (
    manager: EntityManager,
    { fromWalletId, toWalletId, amount, transactionId }: ExecuteTransactionInput
) => {
    const isUnique = await isNewTransaction(manager, transactionId);
    if (!isUnique) {
        return { duplicate: true };
    }

    await lockWallets(manager, [fromWalletId, toWalletId]);

    const balance = await getWalletBalanceById(manager, fromWalletId);
    if (balance < amount) {
        throw new Error("INSUFFICIENT_FUNDS");
    }

    return await writeLedgerEntries(manager, transactionId, fromWalletId, toWalletId, amount);
};

export const initiateTransaction = async (input: ExecuteTransactionInput) => {
    return await dbSource.transaction((manager) =>
        executeTransactionWithManager(manager, input)
    );
};
