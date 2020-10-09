
import {Request, Response} from 'express';
import {getManager} from "typeorm";
import {User} from '../entity/User';

export async function loginUserAction(req: Request, res: Response) {

    console.log("User login attempt ...");

    const {email, password} = req.body;

    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const user = await userRepository.findOne({ email: email });

    // if user was not found then add the current user (until registraiion is added) 
    if (!user) {
        res.sendStatus(403);
        return;
    }

    if ((user.email == email && user.password == password)) {
        res.status(200).json({id: user.id, email: user.email, username: user.username});
    }
    else {
        res.sendStatus(403);
    }

}


