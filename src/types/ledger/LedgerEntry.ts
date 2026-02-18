export interface LedgerEntryT {
    id: string,
    transactionId: string,
    walletId: string,
    amount: number,
    createTs: number,
}