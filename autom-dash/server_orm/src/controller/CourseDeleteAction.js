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
exports.courseDeleteAction = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("../entity/Course");
/**
 * Loads course by a given id.
 */
function courseDeleteAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get a course repository to perform operations with course
        const courseRepository = (0, typeorm_1.getManager)().getRepository(Course_1.Course);
        const id = parseInt(request.params.id);
        console.log("courseDeleteAction: " + id);
        // load a course by a given course id
        const course = yield courseRepository.findOneBy({ id: id });
        if (!course) {
            console.log("courseDeleteAction: no matching course found to delete");
            response.status(404);
            response.end();
            return;
        }
        yield courseRepository.remove(course);
        // return deleted course id
        response.status(200).json({ id });
    });
}
exports.courseDeleteAction = courseDeleteAction;
//# sourceMappingURL=CourseDeleteAction.js.map