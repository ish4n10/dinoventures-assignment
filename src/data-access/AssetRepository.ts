
import { dbSource } from "./Database"
import { AssetType } from "../models/AssetType"

export const createAsset = async (data: { id: string, name: string, createTs: Date }): Promise<AssetType> => {
  const asset = new AssetType()
  asset.id = data.id
  asset.name = data.name
  asset.createTs = data.createTs
  return await dbSource.manager.save(asset)
}

export const getAssetById = async (id: string): Promise<AssetType | null> => {
  return await dbSource.getRepository(AssetType).findOneBy({ id })
}

export const getAllAssets = async (): Promise<AssetType[]> => {
  return await dbSource.getRepository(AssetType).find()
}
