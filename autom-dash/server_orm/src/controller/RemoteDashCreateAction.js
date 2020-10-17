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
exports.remoteDashCreateAction = void 0;
const typeorm_1 = require("typeorm");
const RemoteDash_1 = require("../entity/RemoteDash");
const User_1 = require("../entity/User");
const LearnIR_1 = require("../entity/LearnIR");
/**
 * Saves given item.
 */
function remoteDashCreateAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("RemoteDashCreateAction: request.body=" + JSON.stringify(request.body));
        const userId = request.body.userId;
        const learnIRId = request.body.learnIRId;
        console.log("RemoteDashCreateAction: userId=" + userId);
        console.log("RemoteDashCreateAction: learnIRId=" + learnIRId);
        // get a user repository to perform operations with user 
        const userRepository = typeorm_1.getManager().getRepository(User_1.User);
        // load a user by a given user id
        const user = yield userRepository.findOne(userId);
        console.log("RemoteDashCreateAction: user= " + JSON.stringify(user));
        const learnIRRepository = typeorm_1.getManager().getRepository(LearnIR_1.LearnIR);
        const learnIR = yield learnIRRepository.findOne(learnIRId);
        // get an item repository to perform operations
        const itemRepository = typeorm_1.getManager().getRepository(RemoteDash_1.RemoteDash);
        // create a real object from json object sent over http
        //const newObject = itemRepository.create(request.body)
        const newObject = new RemoteDash_1.RemoteDash();
        newObject.layout = request.body.layout;
        newObject.seqNo = request.body.seqNo;
        ;
        newObject.name = request.body.name;
        ;
        newObject.iconUrl = request.body.iconUrl;
        ;
        newObject.user = user;
        newObject.learnIR = learnIR;
        console.log("RemoteDashCreateAction: newObject=" + JSON.stringify(newObject));
        // save received object 
        const responseObject = yield itemRepository.save(newObject);
        // return saved object back
        response.send(responseObject);
    });
}
exports.remoteDashCreateAction = remoteDashCreateAction;
//# sourceMappingURL=RemoteDashCreateAction.js.map