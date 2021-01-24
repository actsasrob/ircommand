"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAllLessons = void 0;
const database_1 = require("./database");
function readAllLessons(req, res) {
    res.status(200).json({ lessons: database_1.db.readAllLessons() });
}
exports.readAllLessons = readAllLessons;
//# sourceMappingURL=read-all-lessons.route.js.map