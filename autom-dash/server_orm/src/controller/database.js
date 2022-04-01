"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const _ = __importStar(require("lodash"));
const database_data_1 = require("./database-data");
class InMemoryDatabase {
    constructor() {
        this.userCounter = 2;
    }
    readAllLessons() {
        return _.values(database_data_1.LESSONS);
    }
    createUser(email, passwordDigest) {
        const usersPerEmail = _.keyBy(_.values(database_data_1.USERS), "email");
        if (usersPerEmail[email]) {
            const message = "An user already exists with email " + email;
            console.error(message);
            throw new Error(message);
        }
        this.userCounter++;
        const id = this.userCounter;
        const user = {
            id,
            email,
            passwordDigest,
            roles: ["STUDENT"]
        };
        database_data_1.USERS[id] = user;
        console.log(database_data_1.USERS);
        return user;
    }
    findUserByEmail(email) {
        console.log("Finding user by email:", email);
        const users = _.values(database_data_1.USERS);
        const user = _.find(users, user => user.email === email);
        console.log("user retrieved:", user);
        return user;
    }
    findUserById(userId) {
        let user = undefined;
        if (userId) {
            console.log("looking for userId ", userId);
            const users = _.values(database_data_1.USERS);
            user = _.find(users, user => user.id.toString() === userId);
            console.log("user data found:", user);
        }
        return user;
    }
}
exports.db = new InMemoryDatabase();
//# sourceMappingURL=database.js.map