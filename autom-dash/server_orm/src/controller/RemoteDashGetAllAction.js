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
/**
 * Loads all RemoteDashs from the database.
 */
function remoteDashGetAllAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get item repository to perform operations  
        const itemRepository = typeorm_1.getManager().getRepository(RemoteDash_1.RemoteDash);
        // load item by a given id
        const items = yield itemRepository.find();
        console.log("learnIRGetAllAction: " + JSON.stringify(items));
        // return loaded items 
        response.status(200).json({ payload: Object.values(items) });
        //response.send(items);
    });
}
exports.remoteDashGetAllAction = remoteDashGetAllAction;
//# sourceMappingURL=RemoteDashGetAllAction.js.map