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
exports.learnIRCreateAction = void 0;
const typeorm_1 = require("typeorm");
const LearnIR_1 = require("../entity/LearnIR");
const User_1 = require("../entity/User");
/**
 * Saves given item.
 */
function learnIRCreateAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("learnIRCreateAction: request.body=" + JSON.stringify(request.body));
        const userId = request.body.userId;
        console.log("learnIRCreateAction: userId=" + userId);
        // get a user repository to perform operations with user 
        const userRepository = typeorm_1.getManager().getRepository(User_1.User);
        // load a user by a given user id
        const user = yield userRepository.findOne(userId);
        console.log("learnIRCreateAction: user= " + JSON.stringify(user));
        // get an item repository to perform operations
        const itemRepository = typeorm_1.getManager().getRepository(LearnIR_1.LearnIR);
        // create a real object from json object sent over http
        //const newObject = itemRepository.create(request.body)
        const newObject = new LearnIR_1.LearnIR();
        newObject.location = request.body.location;
        newObject.address = request.body.address;
        newObject.seqNo = request.body.seqNo;
        ;
        newObject.user = user;
        console.log("learnIRCreateAction: newObject=" + JSON.stringify(newObject));
        // save received object 
        const responseObject = yield itemRepository.save(newObject);
        // return saved object back
        response.send(responseObject);
    });
}
exports.learnIRCreateAction = learnIRCreateAction;
//# sourceMappingURL=LearnIRCreateAction.js.map