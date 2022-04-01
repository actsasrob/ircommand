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
exports.courseGetByUrlAction = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("../entity/Course");
/**
 * Loads course by a given url.
 */
function courseGetByUrlAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get a course repository to perform operations with course
        const courseRepository = (0, typeorm_1.getManager)().getRepository(Course_1.Course);
        // load a course by a given course id
        const course = yield courseRepository.findOneBy({ id: parseInt(request.params.url) });
        // if course was not found return 404 to the client
        if (!course) {
            response.status(404);
            response.end();
            return;
        }
        // return loaded course
        response.send(course);
    });
}
exports.courseGetByUrlAction = courseGetByUrlAction;
//# sourceMappingURL=CourseGetByUrlAction.js.map