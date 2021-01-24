"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.login = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
//import {db} from "./database";
const argon2 = __importStar(require("argon2"));
//import {DbUser} from "./db-user";
const security_utils_1 = require("./security.utils");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = req.body;
        //const user = db.findUserByEmail(credentials.email);
        const userRepository = typeorm_1.getManager().getRepository(User_1.User);
        // load a user by a given user id
        const user = yield userRepository.findOne({ email: credentials.email });
        if (!user) {
            res.sendStatus(403);
        }
        else {
            loginAndBuildResponse(credentials, user, res);
        }
    });
}
exports.login = login;
function loginAndBuildResponse(credentials, user, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionToken = yield attemptLogin(credentials, user);
            const csrfToken = yield security_utils_1.createCsrfToken();
            console.log("Login successful");
            res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: true });
            res.cookie("XSRF-TOKEN", csrfToken);
            //res.status(200).json({id:user.id, email:user.email, roles: user.roles});
            res.status(200).json({ id: user.id, email: user.email, roles: ['USER'] });
        }
        catch (err) {
            console.log("Login failed:", err);
            res.sendStatus(403);
        }
    });
}
function attemptLogin(credentials, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPasswordValid = yield argon2.verify(user.passwordDigest, credentials.password);
        if (!isPasswordValid) {
            throw new Error("Password Invalid");
        }
        return security_utils_1.createSessionToken(user);
    });
}
//# sourceMappingURL=login.route.js.map