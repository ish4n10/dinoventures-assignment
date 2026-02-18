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
exports.getLedgerEntriesByWalletId = exports.createLedgerEntry = void 0;
const data_source_1 = require("./data-source");
const LedgerEntry_1 = require("../models/LedgerEntry");
const createLedgerEntry = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = new LedgerEntry_1.LedgerEntry();
    entry.id = data.id;
    entry.transactionId = data.transactionId;
    entry.walletId = data.walletId;
    entry.amount = data.amount;
    entry.createTs = data.createTs;
    return yield data_source_1.AppDataSource.manager.save(entry);
});
exports.createLedgerEntry = createLedgerEntry;
const getLedgerEntriesByWalletId = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(LedgerEntry_1.LedgerEntry).find({
        where: { walletId },
        order: { createTs: "DESC" }
    });
});
exports.getLedgerEntriesByWalletId = getLedgerEntriesByWalletId;
