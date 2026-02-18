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
exports.updateUser = exports.getUserById = exports.createUser = void 0;
const data_source_1 = require("./data-source");
const User_1 = require("../models/User");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.User();
    user.id = data.id;
    user.name = data.name;
    user.createTs = data.createTs;
    user.updateTs = data.updateTs;
    return yield data_source_1.AppDataSource.manager.save(user);
});
exports.createUser = createUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id });
});
exports.getUserById = getUserById;
const updateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: data.id });
    if (user) {
        user.name = data.name;
        user.updateTs = data.updateTs;
        return yield data_source_1.AppDataSource.manager.save(user);
    }
    throw new Error("User not found");
});
exports.updateUser = updateUser;
