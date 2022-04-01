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
exports.courseGetAllWithLessonsAction = void 0;
//import {createConnection, ConnectionOptions} from "typeorm";
const typeorm_1 = require("typeorm");
const Course_1 = require("../entity/Course");
const Lesson_1 = require("../entity/Lesson");
/**
 * Loads all courses from the database.
 */
function courseGetAllWithLessonsAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        //const options: ConnectionOptions = {
        const options = {
            // ... other options
            type: "postgres",
            entities: [Course_1.Course, Lesson_1.Lesson]
        };
        let connection = yield (0, typeorm_1.createConnection)(options);
        // load a course by a given course id
        const courses = yield connection.getRepository(Course_1.Course).find({ relations: ["lessons"] });
        // return loaded courses
        response.send(courses);
    });
}
exports.courseGetAllWithLessonsAction = courseGetAllWithLessonsAction;
//# sourceMappingURL=CourseGetAllWithLessonsAction.js.map