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
exports.remoteDashGetAllAction = void 0;
const typeorm_1 = require("typeorm");
const RemoteDash_1 = require("../entity/RemoteDash");
const User_1 = require("../entity/User");
/**
 * Loads all RemoteDashs (for currently logged in user) from the database.
 */
function remoteDashGetAllAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request["user"];
        let tmpUser = new User_1.User();
        tmpUser.id = user.sub;
        console.log("remoteDashGetAllAction: user.sub=" + user.sub);
        const itemRepository = (0, typeorm_1.getManager)().getRepository(RemoteDash_1.RemoteDash);
        const items = yield itemRepository.find({
            where: { user: tmpUser },
            relations: ["user", "learnIR"]
        });
        // return loaded items 
        response.status(200).json({ payload: Object.values(items) });
    });
}
exports.remoteDashGetAllAction = remoteDashGetAllAction;
//# sourceMappingURL=RemoteDashGetAllAction.js.map