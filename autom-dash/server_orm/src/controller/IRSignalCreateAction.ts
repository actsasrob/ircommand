import {Request, Response} from "express";
import {getManager} from "typeorm";
import {IRSignal} from "../entity/IRSignal";
import {User} from "../entity/User";

/**
 * Saves given item.
 */
export async function IRSignalCreateAction(request: Request, response: Response) {

    const user1 = request["user"];

    console.log("IRSignalCreateAction: request.body=" + JSON.stringify(request.body));

    //const userId = request.body.userId;

    console.log("IRSignalCreateAction: userId=" + user1.sub);

    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    //const user = await userRepository. findOne(userId);
    const user = await userRepository. findOne(user1.sub);

    console.log("IRSignalCreateAction: user= " + JSON.stringify(user));

    // get an item repository to perform operations
    const itemRepository = getManager().getRepository(IRSignal);

    // create a real object from json object sent over http
    //const newObject = itemRepository.create(request.body)
    const newObject = new IRSignal();
    newObject.signal = request.body.signal;
    newObject.seqNo = request.body.seqNo;
    newObject.name = request.body.name;
    newObject.iconUrl = request.body.iconUrl;
    newObject.alexaIntent = request.body.alexaIntent;
    newObject.alexaAction = request.body.alexaAction;
    newObject.alexaComponent = request.body.alexaComponent;
    newObject.alexaToggle = request.body.alexaToggle;
    newObject.alexaDigit = request.body.alexaDigit;
    newObject.user = user;

    console.log("IRSignalCreateAction: newObject=" + JSON.stringify(newObject));
    // save received object 
    const responseObject = await itemRepository.save(newObject);

    // return saved object back
    response.send(responseObject);
}
