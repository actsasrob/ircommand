"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCsrfToken = void 0;
function checkCsrfToken(req, res, next) {
    const csrfCookie = req.cookies["XSRF-TOKEN"];
    const csrfHeader = req.headers['x-xsrf-token'];
    if (csrfCookie && csrfHeader && csrfCookie === csrfHeader) {
        next();
    }
    else {
        res.sendStatus(403);
    }
}
exports.checkCsrfToken = checkCsrfToken;
//# sourceMappingURL=csrf.middleware.js.map