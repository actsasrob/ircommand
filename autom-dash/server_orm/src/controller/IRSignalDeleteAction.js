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
exports.IRSignalDeleteAction = void 0;
const typeorm_1 = require("typeorm");
const IRSignal_1 = require("../entity/IRSignal");
/**
 * Delete item by a given id.
 */
function IRSignalDeleteAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get an item repository to perform operations
        const itemRepository = (0, typeorm_1.getManager)().getRepository(IRSignal_1.IRSignal);
        const id = parseInt(request.params.id);
        // load an object by a given id
        //const item = await itemRepository.findOne(id);
        const item = yield itemRepository.findOneBy({ id: id });
        if (!item) {
            response.status(404);
            response.end();
            return;
        }
        yield itemRepository.remove(item);
        // return loaded item id
        response.status(200).json({ id });
    });
}
exports.IRSignalDeleteAction = IRSignalDeleteAction;
//# sourceMappingURL=IRSignalDeleteAction.js.map