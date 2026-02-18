"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAssets = exports.getAssetById = exports.createAsset = void 0;
const data_source_1 = require("./data-source");
const AssetType_1 = require("../models/AssetType");
const createAsset = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const asset = new AssetType_1.AssetType();
    asset.id = data.id;
    asset.name = data.name;
    asset.createTs = data.createTs;
    asset.updateTs = data.updateTs;
    return yield data_source_1.AppDataSource.manager.save(asset);
});
exports.createAsset = createAsset;
const getAssetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(AssetType_1.AssetType).findOneBy({ id });
});
exports.getAssetById = getAssetById;
const getAllAssets = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(AssetType_1.AssetType).find();
});
exports.getAllAssets = getAllAssets;
