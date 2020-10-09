import {Request, Response} from "express";
import {createConnection, ConnectionOptions} from "typeorm";
import {Course} from "../entity/Course";
import {Lesson} from "../entity/Lesson";

/**
 * Loads all courses from the database.
 */
export async function courseGetAllWithLessonsAction(request: Request, response: Response) {

    const options: ConnectionOptions = {
    // ... other options
    type: "postgres",
    entities: [Course, Lesson]
    };

    let connection = await createConnection(options);

    // load a course by a given course id
    const courses = await connection.getRepository(Course).find({ relations: ["lessons"] });

    // return loaded courses
    response.send(courses);
}
