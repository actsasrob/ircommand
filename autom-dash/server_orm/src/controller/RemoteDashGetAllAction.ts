import {Request, Response} from "express";
import {getManager} from "typeorm";
import {RemoteDash} from "../entity/RemoteDash";
import {User} from "../entity/User";

/**
 * Loads all RemoteDashs (for currently logged in user) from the database.
 */
export async function remoteDashGetAllAction(request: Request, response: Response) {

    const user = request["user"];
    let tmpUser = new User();
    tmpUser.id = user.sub;

    console.log("remoteDashGetAllAction: user.sub=" + user.sub);

    const itemRepository = getManager().getRepository(RemoteDash);
    const items = await itemRepository.find({ 
       where: {user: tmpUser},
       relations: ["user", "learnIR"]
    });

    // return loaded items 
    response.status(200).json({payload:Object.values(items)})
}
