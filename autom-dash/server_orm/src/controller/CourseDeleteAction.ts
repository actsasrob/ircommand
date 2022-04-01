import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Course} from "../entity/Course";

/**
 * Loads course by a given id.
 */
export async function courseDeleteAction(request: Request, response: Response) {

    // get a course repository to perform operations with course
    const courseRepository = getManager().getRepository(Course);

    const id = parseInt(request.params.id);

    console.log("courseDeleteAction: " + id);
    // load a course by a given course id
    const course = await courseRepository.findOneBy({id: id});

    if (!course) {
        console.log("courseDeleteAction: no matching course found to delete");
        response.status(404);
        response.end();
        return;
    }

    await courseRepository.remove(course);

    // return deleted course id
    response.status(200).json({id});
}
