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
exports.loginUserAction = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
function loginUserAction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("server_orm: User login attempt ...");
        const { email, passwordDigest } = req.body;
        console.log("loginUserAction: email=" + email);
        // get a user repository to perform operations with user 
        const userRepository = (0, typeorm_1.getManager)().getRepository(User_1.User);
        // load a user by a given user id
        const user = yield userRepository.findOneBy({ email: email });
        //console.log("loginUserAction: " + JSON.stringify(user));
        if (!user) {
            res.sendStatus(403);
            return;
        }
        if ((user.email == email && user.passwordDigest == passwordDigest)) {
            res.status(200).json({ id: user.id, email: user.email });
        }
        else {
            res.sendStatus(403);
        }
    });
}
exports.loginUserAction = loginUserAction;
//# sourceMappingURL=LoginUserAction.js.map