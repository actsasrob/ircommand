import {Request, Response} from "express";
import {getManager} from "typeorm";
import {IRSignal} from "../entity/IRSignal";

/**
 * Saves given item.
 */
export async function IRSignalCreateAction(request: Request, response: Response) {

    // get an item repository to perform operations
    const itemRepository = getManager().getRepository(IRSignal);

    // create a real object from json object sent over http
    const newObject = itemRepository.create(request.body)

    // save received object 
    await itemRepository.save(newObject);

    // return saved object back
    response.send(newObject);
}
