"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonGetByCourseIdAction = void 0;
const typeorm_1 = require("typeorm");
const Lesson_1 = require("../entity/Lesson");
/**
 * Loads lesson by a given id.
 */
function lessonGetByCourseIdAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get a lesson repository to perform operations with lesson
        const lessonRepository = (0, typeorm_1.getManager)().getRepository(Lesson_1.Lesson);
        // load a lesson by a given lesson id
        const lessons = yield lessonRepository
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
    });
}
exports.lessonGetByCourseIdAction = lessonGetByCourseIdAction;
//# sourceMappingURL=LessonGetByCourseIdAction.js.map