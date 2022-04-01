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
exports.createUser = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
//import {db} from "./database";
const argon2 = __importStar(require("argon2"));
const password_validation_1 = require("./password-validation");
const security_utils_1 = require("./security.utils");
function createUser(req, res) {
    const credentials = req.body;
    const errors = (0, password_validation_1.validatePassword)(credentials.password);
    if (errors.length > 0) {
        res.status(400).json({ errors });
    }
    else {
        createUserAndSession(res, credentials)
            .catch((err) => {
            console.log("Error creating new user", err);
            res.sendStatus(500);
        });
    }
}
exports.createUser = createUser;
function createUserAndSession(res, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordDigest = yield argon2.hash(credentials.password);
        //const user = db.createUser(credentials.email, passwordDigest);
        const userRepository = (0, typeorm_1.getManager)().getRepository(User_1.User);
        // check for existing user by email address
        const user = yield userRepository.findOneBy({ email: credentials.email });
        if (user) {
            const message = "User already exists with email " + credentials.email;
            console.error(message);
            throw new Error(message);
        }
        const newUser = new User_1.User();
        newUser.email = credentials.email;
        newUser.passwordDigest = passwordDigest;
        //console.log("signupUserAction: newObject=" + JSON.stringify(newObject));
        // save received object 
        const responseObject = yield userRepository.save(newUser);
        newUser.passwordDigest = undefined;
        const sessionToken = yield (0, security_utils_1.createSessionToken)(newUser);
        const csrfToken = yield (0, security_utils_1.createCsrfToken)();
        res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: true });
        res.cookie("XSRF-TOKEN", csrfToken);
        res.status(200).json({ id: responseObject.id, email: responseObject.email, roles: ['USER'] });
    });
}
//# sourceMappingURL=create-user.route.js.map