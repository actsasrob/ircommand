import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Lesson} from "../entity/Lesson";

/**
 * Loads all lessons from the database.
 */
export async function lessonGetAllAction(request: Request, response: Response) {

    // get a lesson repository to perform operations with lesson
    const lessonRepository = getManager().getRepository(Lesson);

    // load a lesson by a given lesson id
    const lessons = await lessonRepository.find();

    // return loaded lessons
    response.send(lessons);
}
