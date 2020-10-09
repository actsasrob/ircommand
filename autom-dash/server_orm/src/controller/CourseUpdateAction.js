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
exports.courseUpdateAction = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("../entity/Course");
/**
 * Saves given course.
 */
function courseUpdateAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("courseUpdateAction:");
        // get a course repository to perform operations with course
        const courseRepository = typeorm_1.getManager().getRepository(Course_1.Course);
        // create a real course object from course json object sent over http
        const newCourse = courseRepository.create(request.body);
        // save received course
        yield courseRepository.save(newCourse);
        // return saved course back
        response.send(newCourse);
    });
}
exports.courseUpdateAction = courseUpdateAction;
//# sourceMappingURL=CourseUpdateAction.js.map