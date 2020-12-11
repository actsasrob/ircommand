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
exports.IRSignalCreateAction = void 0;
const typeorm_1 = require("typeorm");
const IRSignal_1 = require("../entity/IRSignal");
const User_1 = require("../entity/User");
/**
 * Saves given item.
 */
function IRSignalCreateAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("IRSignalCreateAction: request.body=" + JSON.stringify(request.body));
        const userId = request.body.userId;
        console.log("IRSignalCreateAction: userId=" + userId);
        // get a user repository to perform operations with user 
        const userRepository = typeorm_1.getManager().getRepository(User_1.User);
        // load a user by a given user id
        const user = yield userRepository.findOne(userId);
        console.log("IRSignalCreateAction: user= " + JSON.stringify(user));
        // get an item repository to perform operations
        const itemRepository = typeorm_1.getManager().getRepository(IRSignal_1.IRSignal);
        // create a real object from json object sent over http
        //const newObject = itemRepository.create(request.body)
        const newObject = new IRSignal_1.IRSignal();
        newObject.signal = request.body.signal;
        newObject.seqNo = request.body.seqNo;
        newObject.name = request.body.name;
        newObject.iconUrl = request.body.iconUrl;
        newObject.alexaIntent = request.body.alexaIntent;
        newObject.alexaAction = request.body.alexaAction;
        newObject.alexaComponent = request.body.alexaComponent;
        newObject.alexaToggle = request.body.alexaToggle;
        newObject.alexaDigit = request.body.alexaDigit;
        newObject.user = user;
        console.log("IRSignalCreateAction: newObject=" + JSON.stringify(newObject));
        // save received object 
        const responseObject = yield itemRepository.save(newObject);
        // return saved object back
        response.send(responseObject);
    });
}
exports.IRSignalCreateAction = IRSignalCreateAction;
//# sourceMappingURL=IRSignalCreateAction.js.map