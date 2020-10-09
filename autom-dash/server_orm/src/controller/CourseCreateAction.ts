import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Course} from "../entity/Course";

/**
 * Saves given course.
 */
export async function courseCreateAction(request: Request, response: Response) {

    console.log("courseCreateAtion:");
    // get a course repository to perform operations with course
    const courseRepository = getManager().getRepository(Course);

    // create a real course object from course json object sent over http
    const newCourse = courseRepository.create(request.body)

    // save received course
    await courseRepository.save(newCourse);

    // return saved course back
    response.send(newCourse);
}
