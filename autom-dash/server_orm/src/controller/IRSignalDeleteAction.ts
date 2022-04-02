import {Request, Response} from "express";
import {getManager} from "typeorm";
import {IRSignal} from "../entity/IRSignal";

/**
 * Delete item by a given id.
 */
export async function IRSignalDeleteAction(request: Request, response: Response) {

    // get an item repository to perform operations
    const itemRepository = getManager().getRepository(IRSignal);

    const id = parseInt(request.params.id);

    // load an object by a given id
    const item = await itemRepository.findOneBy({id: id});

    if (!item) {
        response.status(404);
        response.end();
        return;
    }

    await itemRepository.remove(item);

    // return loaded item id
    response.status(200).json({id});
}
