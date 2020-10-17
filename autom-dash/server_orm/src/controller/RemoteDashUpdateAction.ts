import {Request, Response} from "express";
import {getManager} from "typeorm";
import {RemoteDash} from "../entity/RemoteDash";
import {User} from "../entity/User";
import {LearnIR} from "../entity/LearnIR";

/**
 * Saves given item.
 */
export async function remoteDashUpdateAction(request: Request, response: Response) {
    console.log("RemoteDashUpdateAction: request.body=" + JSON.stringify(request.body));

    //const userId = request.body.userId;
    const learnIRId = request.body.learnIRId;

    //console.log("RemoteDashUpdateAction: userId=" + userId);
    console.log("RemoteDashUpdateAction: learnIRId=" + learnIRId);

    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    //const user = await userRepository. findOne(userId);

    //console.log("RemoteDashUpdateAction: user= " + JSON.stringify(user));

    const learnIRRepository = getManager().getRepository(LearnIR);
    const learnIR = await learnIRRepository. findOne(learnIRId);

    // get an item repository to perform operations
    const itemRepository = getManager().getRepository(RemoteDash);

    // create a real object from json object sent over http
    //const newObject = itemRepository.create(request.body)
    const newObject = new RemoteDash();
    newObject.id = request.body.id;
    newObject.layout = request.body.layout;
    newObject.seqNo = request.body.seqNo;;
    newObject.name = request.body.name;;
    newObject.iconUrl = request.body.iconUrl;;
    //newObject.user = user;
    newObject.learnIR = learnIR;

    console.log("RemoteDashUpdateAction: newObject=" + JSON.stringify(newObject));
    // save received object 
    const responseObject = await itemRepository.save(newObject);

    // return saved object back
    response.send(responseObject);
}
