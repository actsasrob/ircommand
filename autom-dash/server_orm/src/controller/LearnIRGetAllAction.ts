import {Request, Response} from "express";
import {getManager} from "typeorm";
import {LearnIR} from "../entity/LearnIR";
import {User} from "../entity/User";

/**
 * Loads all LearnIRs (for currently logged in user)  from the database.
 */
export async function learnIRGetAllAction(request: Request, response: Response) {

    const user = request["user"];
    let tmpUser = new User();
    tmpUser.id = user.sub;

    // get item repository to perform operations  
    const itemRepository = getManager().getRepository(LearnIR);

    // load item by a given id
    //const items = await itemRepository.find({ relations: ["user"] });
    const items = await itemRepository.find({ 
       where: { user: tmpUser},
       relations: ["user"] 
    });

    console.log("learnIRGetAllAction: " + JSON.stringify(items));

    // return loaded items 
    response.status(200).json({payload:Object.values(items)})
}
