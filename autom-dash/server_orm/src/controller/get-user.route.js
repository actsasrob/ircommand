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
exports.getUser = void 0;
//import {db} from "./database";
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = req["user"];
        if (userInfo) {
            //const user = db.findUserById(userInfo.sub);
            const userRepository = typeorm_1.getManager().getRepository(User_1.User);
            // check for existing user by email address
            const user = yield userRepository.findOne({ id: userInfo.sub });
            //res.status(200).json({email:user.email, id:user.id, roles: user.roles});
            res.status(200).json({ email: user.email, id: user.id, roles: ['USER'] });
        }
        else {
            res.sendStatus(204);
        }
    });
}
exports.getUser = getUser;
//# sourceMappingURL=get-user.route.js.map