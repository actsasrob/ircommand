
import {Request, Response} from 'express';
import {getManager} from "typeorm";
import {User} from '../entity/User';

export async function signupUserAction(req: Request, res: Response) {

    console.log("server_orm: User signup attempt ...");

    const {email, username, password} = req.body;

    console.log("signupUserAction: email=" + email);
    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // check for existing user by email address
    const user = await userRepository.findOne({ email: email });
    //console.log("signupUserAction: " + JSON.stringify(user));

    // if user already exists return with error status 
    if (user) {
        res.sendStatus(403);
        return;
    }

    // create a real object from json object sent over http
    //const newObject = itemRepository.create(request.body)
    const newObject = new User();
    newObject.email = email;
    newObject.username = username;
    newObject.password = password;
 
    //console.log("signupUserAction: newObject=" + JSON.stringify(newObject));
    // save received object 
    const responseObject = await userRepository.save(newObject);

    res.status(200).json({id: responseObject.id, email: responseObject.email, username: responseObject.username});
}


