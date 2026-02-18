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
exports.getWalletsByOwnerId = exports.getWalletById = exports.createWallet = void 0;
const data_source_1 = require("./data-source");
const Wallet_1 = require("../models/Wallet");
const createWallet = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = new Wallet_1.Wallet();
    wallet.id = data.id;
    wallet.ownerType = data.ownerType;
    wallet.ownerId = data.ownerId;
    wallet.assetId = data.assetId;
    wallet.createTs = data.createTs;
    wallet.updateTs = data.updateTs;
    return yield data_source_1.AppDataSource.manager.save(wallet);
});
exports.createWallet = createWallet;
const getWalletById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(Wallet_1.Wallet).findOneBy({ id });
});
exports.getWalletById = getWalletById;
const getWalletsByOwnerId = (ownerId, ownerType) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(Wallet_1.Wallet).findBy({ ownerId, ownerType });
});
exports.getWalletsByOwnerId = getWalletsByOwnerId;
