import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Course} from "../entity/Course";

/**
 * Loads all courses from the database.
 */
export async function courseGetAllAction(request: Request, response: Response) {

    // get a course repository to perform operations with course
    const courseRepository = getManager().getRepository(Course);

    // load a course by a given course id
    const courses = await courseRepository.find();

    console.log("courseGetAllAction: " + JSON.stringify(courses));

    // return loaded courses
    response.status(200).json({payload:Object.values(courses)})
    //response.send(courses);
}
