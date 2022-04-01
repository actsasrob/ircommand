
import {Request, Response} from "express";
import {getManager} from "typeorm";
import {User} from '../entity/User';
//import {db} from "./database";
import * as argon2 from 'argon2';
import {validatePassword} from "./password-validation";
import moment = require("moment");
import {createCsrfToken, createSessionToken} from "./security.utils";




export function createUser(req: Request, res:Response) {

    const credentials = req.body;

    const errors = validatePassword(credentials.password);

    if (errors.length > 0) {
        res.status(400).json({errors});
    }
    else {

        createUserAndSession(res, credentials)
            .catch((err) => {
            console.log("Error creating new user", err);
            res.sendStatus(500);
        });

    }

}

async function createUserAndSession(res:Response, credentials) {

    const passwordDigest = await argon2.hash(credentials.password);

    //const user = db.createUser(credentials.email, passwordDigest);

    const userRepository = getManager().getRepository(User);

    // check for existing user by email address
    const user = await userRepository.findOneBy({ email: credentials.email });

    if (user) {

       const message = "User already exists with email " + credentials.email;
       console.error(message);
       throw new Error(message);
    }


    const newUser = new User();
    newUser.email = credentials.email;
    newUser.passwordDigest = passwordDigest;
 
    //console.log("signupUserAction: newObject=" + JSON.stringify(newObject));
    // save received object 
    const responseObject = await userRepository.save(newUser);
    newUser.passwordDigest = undefined;
    const sessionToken = await createSessionToken(newUser);

    const csrfToken = await createCsrfToken();

    res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});

    res.cookie("XSRF-TOKEN", csrfToken);

    res.status(200).json({id:responseObject.id, email:responseObject.email, roles: [ 'USER' ]});
}







