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
exports.remoteDashDeleteAction = void 0;
const typeorm_1 = require("typeorm");
const RemoteDash_1 = require("../entity/RemoteDash");
/**
 * Delete item by a given id.
 */
function remoteDashDeleteAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get an item repository to perform operations
        const itemRepository = typeorm_1.getManager().getRepository(RemoteDash_1.RemoteDash);
        const id = request.params.id;
        // load an object by a given id
        const item = yield itemRepository.findOne(id);
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
exports.remoteDashDeleteAction = remoteDashDeleteAction;
//# sourceMappingURL=RemoteDashDeleteAction.js.map