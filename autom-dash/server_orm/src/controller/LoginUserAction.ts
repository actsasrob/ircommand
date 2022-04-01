
import {Request, Response} from 'express';
import {getManager} from "typeorm";
import {User} from '../entity/User';

export async function loginUserAction(req: Request, res: Response) {

    console.log("server_orm: User login attempt ...");

    const {email, passwordDigest} = req.body;

    console.log("loginUserAction: email=" + email);
    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const user = await userRepository.findOneBy({ email: email });
    //console.log("loginUserAction: " + JSON.stringify(user));

    if (!user) {
        res.sendStatus(403);
        return;
    }

    if ((user.email == email && user.passwordDigest == passwordDigest)) {
        res.status(200).json({id: user.id, email: user.email});
    }
    else {
        res.sendStatus(403);
    }

}


