import {Request, Response} from "express";
import {getManager} from "typeorm";
import {LearnIR} from "../entity/LearnIR";

/**
 * Loads all LearnIRs from the database.
 */
export async function learnIRGetAllAction(request: Request, response: Response) {

    // get item repository to perform operations  
    const itemRepository = getManager().getRepository(LearnIR);

    // load item by a given id
    const items = await itemRepository.find({ relations: ["user"] });

    console.log("learnIRGetAllAction: " + JSON.stringify(items));

    // return loaded items 
    response.status(200).json({payload:Object.values(items)})
    //response.send(items);
}
