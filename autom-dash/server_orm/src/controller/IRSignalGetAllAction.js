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
exports.IRSignalGetAllAction = void 0;
const typeorm_1 = require("typeorm");
const IRSignal_1 = require("../entity/IRSignal");
const User_1 = require("../entity/User");
/**
 * Loads all IRSignals (for currently logged in user) from the database.
 */
function IRSignalGetAllAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request["user"];
        let tmpUser = new User_1.User();
        tmpUser.id = user.sub;
        // get item repository to perform operations  
        const itemRepository = typeorm_1.getManager().getRepository(IRSignal_1.IRSignal);
        // load item by a given id
        //const items = await itemRepository.find({ relations: ["user"] });
        const items = yield itemRepository.find({
            where: { user: tmpUser },
            relations: ["user"]
        });
        console.log("IRSignalGetAllAction: " + JSON.stringify(items));
        // return loaded items 
        response.status(200).json({ payload: Object.values(items) });
        //response.send(items);
    });
}
exports.IRSignalGetAllAction = IRSignalGetAllAction;
//# sourceMappingURL=IRSignalGetAllAction.js.map