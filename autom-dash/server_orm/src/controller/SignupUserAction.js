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
exports.signupUserAction = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
function signupUserAction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("server_orm: User signup attempt ...");
        const { email, username, password } = req.body;
        console.log("signupUserAction: email=" + email);
        // get a user repository to perform operations with user 
        const userRepository = typeorm_1.getManager().getRepository(User_1.User);
        // check for existing user by email address
        const user = yield userRepository.findOne({ email: email });
        //console.log("signupUserAction: " + JSON.stringify(user));
        // if user already exists return with error status 
        if (user) {
            res.sendStatus(403);
            return;
        }
        // create a real object from json object sent over http
        //const newObject = itemRepository.create(request.body)
        const newObject = new User_1.User();
        newObject.email = email;
        newObject.username = username;
        newObject.password = password;
        //console.log("signupUserAction: newObject=" + JSON.stringify(newObject));
        // save received object 
        const responseObject = yield userRepository.save(newObject);
        res.status(200).json({ id: responseObject.id, email: responseObject.email, username: responseObject.username });
    });
}
exports.signupUserAction = signupUserAction;
//# sourceMappingURL=SignupUserAction.js.map