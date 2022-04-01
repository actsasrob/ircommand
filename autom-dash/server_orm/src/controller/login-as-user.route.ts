


//import {db} from "./database";
import {getManager} from "typeorm";
import {User} from '../entity/User';
import {createSessionToken} from "./security.utils";

export async function loginAsUser(req, res) {

    const impersonatedUserEmail = req.body.email;

    //const impersonatedUser = db.findUserByEmail(impersonatedUserEmail);

    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const impersonatedUser = await userRepository.findOneBy({ email: impersonatedUserEmail });
    createSessionToken(impersonatedUser)
        .then(sessionToken => {

            res.cookie("SESSIONID", sessionToken,
                {httpOnly:true, secure:true});

            res.status(200).json({
                id:impersonatedUser.id,
                email: impersonatedUser.email,
                //roles: impersonatedUser.roles
                roles: [ 'USER' ] 
            });


        })
        .catch(err => {
                console.log("Error trying to login as user",err);
                res.sendStatus(500);
            });


}
