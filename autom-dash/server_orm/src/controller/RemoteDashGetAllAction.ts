import {Request, Response} from "express";
import {getManager} from "typeorm";
import {RemoteDash} from "../entity/RemoteDash";

/**
 * Loads all RemoteDashs from the database.
 */
export async function remoteDashGetAllAction(request: Request, response: Response) {

    // get item repository to perform operations  
    const itemRepository = getManager().getRepository(RemoteDash);

    // load items with associated relations
    const items = await itemRepository.find({ relations: ["user", "learnIR"] });

    console.log("RemoteDashGetAllAction: " + JSON.stringify(items));

    // return loaded items 
    response.status(200).json({payload:Object.values(items)})
    //response.send(items);
}