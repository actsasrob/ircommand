import {Request, Response} from "express";
import {getManager} from "typeorm";
import {IRSignal} from "../entity/IRSignal";
import {User} from "../entity/User";

/**
 * Loads all IRSignals (for currently logged in user) from the database.
 */
export async function IRSignalGetAllAction(request: Request, response: Response) {

    const user = request["user"];
    let tmpUser = new User();
    tmpUser.id = user.sub;

    // get item repository to perform operations  
    const itemRepository = getManager().getRepository(IRSignal);

    // load item by a given id
    //const items = await itemRepository.find({ relations: ["user"] });
    const items = await itemRepository.find({ 
       where: { user: tmpUser },
       relations: ["user"] 
    });

    console.log("IRSignalGetAllAction: " + JSON.stringify(items));

    // return loaded items 
    response.status(200).json({payload:Object.values(items)})
    //response.send(items);
}
