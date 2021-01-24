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
exports.createCsrfToken = exports.decodeJwt = exports.createSessionToken = exports.signJwt = exports.randomBytes = void 0;
const util = require('util');
const crypto = require('crypto');
const jwt = __importStar(require("jsonwebtoken"));
const fs = __importStar(require("fs"));
exports.randomBytes = util.promisify(crypto.randomBytes);
exports.signJwt = util.promisify(jwt.sign);
const RSA_PRIVATE_KEY = fs.readFileSync('./automdash.com.key');
const RSA_PUBLIC_KEY = fs.readFileSync('./automdash.com.crt');
const SESSION_DURATION = 1000;
function createSessionToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.signJwt({
            //roles: user.roles
            roles: ['USER']
        }, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: 7200,
            subject: user.id.toString()
        });
    });
}
exports.createSessionToken = createSessionToken;
function decodeJwt(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = yield jwt.verify(token, RSA_PUBLIC_KEY);
        console.log("decoded JWT payload", payload);
        return payload;
    });
}
exports.decodeJwt = decodeJwt;
function createCsrfToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.randomBytes(32).then(bytes => bytes.toString("hex"));
    });
}
exports.createCsrfToken = createCsrfToken;
//# sourceMappingURL=security.utils.js.map