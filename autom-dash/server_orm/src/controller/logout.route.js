"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
function logout(req, res) {
    res.clearCookie("SESSIONID");
    res.clearCookie("XSRF-TOKEN");
    console.log("Logout");
    res.status(200).json({ message: 'Logout Successful' });
}
exports.logout = logout;
//# sourceMappingURL=logout.route.js.map