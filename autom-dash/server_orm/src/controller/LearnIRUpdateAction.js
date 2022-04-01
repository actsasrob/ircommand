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
exports.learnIRUpdateAction = void 0;
const typeorm_1 = require("typeorm");
const LearnIR_1 = require("../entity/LearnIR");
/**
 * Updates given item.
 */
function learnIRUpdateAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get an item repository to perform operations
        const itemRepository = (0, typeorm_1.getManager)().getRepository(LearnIR_1.LearnIR);
        // create a real object from json object sent over http
        const newObject = itemRepository.create(request.body);
        // save received object 
        yield itemRepository.save(newObject);
        // return saved object back
        response.send(newObject);
    });
}
exports.learnIRUpdateAction = learnIRUpdateAction;
//# sourceMappingURL=LearnIRUpdateAction.js.map