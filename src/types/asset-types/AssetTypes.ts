export type AssetNames = "Gold" | "Silver" | "Diamond" | string;

export interface AssetType {
    id: string,
    name: AssetNames,
    createTs: Date,
    updateTs: Date
}