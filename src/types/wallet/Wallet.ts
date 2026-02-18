export type UserWalletType = {
    type: "USER",
    userId: string,
}

export type SystemWalletType = {
    type: "SYSTEM",
    systemId: string,
}

export type WalletType = UserWalletType | SystemWalletType;

export interface WalletT {
    id: string,
    owner: WalletType,
    assetId: string,
    createTs: Date,
}