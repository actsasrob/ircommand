import {Request, Response} from "express";
import {getManager} from "typeorm";
import {IRSignal} from "../entity/IRSignal";

/**
 * Loads all IRSignals from the database.
 */
export async function IRSignalGetAllAction(request: Request, response: Response) {

    // get item repository to perform operations  
    const itemRepository = getManager().getRepository(IRSignal);

    // load item by a given id
    const items = await itemRepository.find({ relations: ["user"] });

    console.log("IRSignalGetAllAction: " + JSON.stringify(items));

    // return loaded items 
    response.status(200).json({payload:Object.values(items)})
    //response.send(items);
}
