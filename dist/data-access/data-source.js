"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const SystemUser_1 = require("../models/SystemUser");
const AssetType_1 = require("../models/AssetType");
const Wallet_1 = require("../models/Wallet");
const LedgerEntry_1 = require("../models/LedgerEntry");
const User_1 = require("../models/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [User_1.User, SystemUser_1.SystemUser, AssetType_1.AssetType, Wallet_1.Wallet, LedgerEntry_1.LedgerEntry],
    migrations: [],
    subscribers: [],
});
