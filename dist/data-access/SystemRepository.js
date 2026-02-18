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
exports.getSystemUserById = exports.createSystemUser = void 0;
const data_source_1 = require("./data-source");
const SystemUser_1 = require("../models/SystemUser");
const createSystemUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new SystemUser_1.SystemUser();
    user.id = data.id;
    user.name = data.name;
    user.createTs = data.createTs;
    user.updateTs = data.updateTs;
    return yield data_source_1.AppDataSource.manager.save(user);
});
exports.createSystemUser = createSystemUser;
const getSystemUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(SystemUser_1.SystemUser).findOneBy({ id });
});
exports.getSystemUserById = getSystemUserById;
