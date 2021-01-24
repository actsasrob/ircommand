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
exports.retrieveUserIdFromRequest = void 0;
const security_utils_1 = require("./security.utils");
function retrieveUserIdFromRequest(req, res, next) {
    const jwt = req.cookies["SESSIONID"];
    if (jwt) {
        handleSessionCookie(jwt, req)
            .then(() => next())
            .catch(err => {
            console.error(err);
            next();
        });
    }
    else {
        next();
    }
}
exports.retrieveUserIdFromRequest = retrieveUserIdFromRequest;
function handleSessionCookie(jwt, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = yield security_utils_1.decodeJwt(jwt);
            req["user"] = payload;
        }
        catch (err) {
            console.log("Error: Could not extract user from request:", err.message);
        }
    });
}
//# sourceMappingURL=get-user.middleware.js.map