import {Request, Response} from "express";
import {getManager} from "typeorm";
import {LearnIR} from "../entity/LearnIR";
import {User} from "../entity/User";

/**
 * Saves given item.
 */
export async function learnIRCreateAction(request: Request, response: Response) {

    const user1 = request["user"];

    console.log("learnIRCreateAction: request.body=" + JSON.stringify(request.body));

    //const userId = request.body.userId;

    console.log("learnIRCreateAction: userId=" + user1.sub);

    // get a user repository to perform operations with user 
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const user = await userRepository. findOneBy({id: user1.sub});

    console.log("learnIRCreateAction: user= " + JSON.stringify(user));
    // get an item repository to perform operations
    const itemRepository = getManager().getRepository(LearnIR);

    // create a real object from json object sent over http
    //const newObject = itemRepository.create(request.body)
    const newObject = new LearnIR();
    newObject.location = request.body.location;
    newObject.address = request.body.address;
    newObject.seqNo = request.body.seqNo;;
    newObject.user = user;
 
    console.log("learnIRCreateAction: newObject=" + JSON.stringify(newObject));
    // save received object 
    const responseObject = await itemRepository.save(newObject);

    // return saved object back
    response.send(responseObject);
}
