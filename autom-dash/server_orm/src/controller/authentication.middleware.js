"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAuthenticated = void 0;
function checkIfAuthenticated(req, res, next) {
    if (req['user']) {
        next();
    }
    else {
        res.sendStatus(403);
    }
}
exports.checkIfAuthenticated = checkIfAuthenticated;
//# sourceMappingURL=authentication.middleware.js.map