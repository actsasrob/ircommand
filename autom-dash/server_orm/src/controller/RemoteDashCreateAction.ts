import {Request, Response} from "express";
import {getManager} from "typeorm";
import {RemoteDash} from "../entity/RemoteDash";
import {User} from "../entity/User";

/**
 * Saves given item.
 */
export async function remoteDashCreateAction(request: Request, response: Response) {
    console.log("RemoteDashCreateAction: request.body=" + JSON.stringify(request.body));

    const userId = request.body.userId;

    console.log("RemoteDashCreateAction: userId=" + userId);

    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const user = await userRepository. findOne(userId);

    console.log("RemoteDashCreateAction: user= " + JSON.stringify(user));

    // get an item repository to perform operations
    const itemRepository = getManager().getRepository(RemoteDash);

    // create a real object from json object sent over http
    //const newObject = itemRepository.create(request.body)
    const newObject = new RemoteDash();
    newObject.layout = request.body.layout;
    newObject.seqNo = request.body.seqNo;;
    newObject.user = user;

    console.log("RemoteDashCreateAction: newObject=" + JSON.stringify(newObject));
    // save received object 
    const responseObject = await itemRepository.save(newObject);

    // return saved object back
    response.send(responseObject);
}
