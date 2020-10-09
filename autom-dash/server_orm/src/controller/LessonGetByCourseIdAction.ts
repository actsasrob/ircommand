import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Lesson} from "../entity/Lesson";

/**
 * Loads lesson by a given id.
 */
export async function lessonGetByCourseIdAction(request: Request, response: Response) {

    // get a lesson repository to perform operations with lesson
    const lessonRepository = getManager().getRepository(Lesson);

    // load a lesson by a given lesson id
    const lessons = await lessonRepository
                            .createQueryBuilder("lesson")
                            .where("lesson.courseId = :courseId")
                            .orderBy("lesson.seqNo", "ASC")
                            .setParameters({ courseId: request.params.courseId })
                            .getMany();

    // if lesson was not found return 404 to the client
    if (!lessons) {
        response.status(404);
        response.end();
        return;
    }

    // return loaded lesson
    response.send(lessons);
}
