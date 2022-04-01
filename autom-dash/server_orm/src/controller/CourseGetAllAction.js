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
exports.courseGetAllAction = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("../entity/Course");
/**
 * Loads all courses from the database.
 */
function courseGetAllAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get a course repository to perform operations with course
        const courseRepository = (0, typeorm_1.getManager)().getRepository(Course_1.Course);
        // load a course by a given course id
        const courses = yield courseRepository.find();
        console.log("courseGetAllAction: " + JSON.stringify(courses));
        // return loaded courses
        response.status(200).json({ payload: Object.values(courses) });
        //response.send(courses);
    });
}
exports.courseGetAllAction = courseGetAllAction;
//# sourceMappingURL=CourseGetAllAction.js.map