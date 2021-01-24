

import {Request, Response} from "express";
//import {db} from "./database";
import {getManager} from "typeorm";
import {User} from '../entity/User';



export async function getUser(req:Request, res:Response) {

    const userInfo = req["user"];

    if (userInfo) {

        //const user = db.findUserById(userInfo.sub);
        const userRepository = getManager().getRepository(User);

        // check for existing user by email address
        const user = await userRepository.findOne({ id: userInfo.sub });

        //res.status(200).json({email:user.email, id:user.id, roles: user.roles});
        res.status(200).json({email:user.email, id:user.id, roles: [ 'USER' ]});
    }
    else {
        res.sendStatus(204);
    }
}
