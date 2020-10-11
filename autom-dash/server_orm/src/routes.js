"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const PostGetAllAction_1 = require("./controller/PostGetAllAction");
const PostGetByIdAction_1 = require("./controller/PostGetByIdAction");
const PostSaveAction_1 = require("./controller/PostSaveAction");
const LoginUserAction_1 = require("./controller/LoginUserAction");
const CourseGetAllAction_1 = require("./controller/CourseGetAllAction");
const CourseGetAllWithLessonsAction_1 = require("./controller/CourseGetAllWithLessonsAction");
const CourseGetByIdAction_1 = require("./controller/CourseGetByIdAction");
const CourseGetByUrlAction_1 = require("./controller/CourseGetByUrlAction");
const CourseCreateAction_1 = require("./controller/CourseCreateAction");
const CourseUpdateAction_1 = require("./controller/CourseUpdateAction");
const CourseDeleteAction_1 = require("./controller/CourseDeleteAction");
const LessonGetAllAction_1 = require("./controller/LessonGetAllAction");
const LessonGetByCourseIdAction_1 = require("./controller/LessonGetByCourseIdAction");
const LearnIRGetAllAction_1 = require("./controller/LearnIRGetAllAction");
const LearnIRCreateAction_1 = require("./controller/LearnIRCreateAction");
const LearnIRUpdateAction_1 = require("./controller/LearnIRUpdateAction");
const LearnIRDeleteAction_1 = require("./controller/LearnIRDeleteAction");
const IRSignalGetAllAction_1 = require("./controller/IRSignalGetAllAction");
const IRSignalCreateAction_1 = require("./controller/IRSignalCreateAction");
const IRSignalUpdateAction_1 = require("./controller/IRSignalUpdateAction");
const IRSignalDeleteAction_1 = require("./controller/IRSignalDeleteAction");
const RemoteDashGetAllAction_1 = require("./controller/RemoteDashGetAllAction");
const RemoteDashCreateAction_1 = require("./controller/RemoteDashCreateAction");
const RemoteDashUpdateAction_1 = require("./controller/RemoteDashUpdateAction");
const RemoteDashDeleteAction_1 = require("./controller/RemoteDashDeleteAction");
/**
 * All application routes.
 */
exports.AppRoutes = [
    {
        path: "/api/login",
        method: "post",
        action: LoginUserAction_1.loginUserAction
    },
    {
        path: "/api/posts",
        method: "get",
        action: PostGetAllAction_1.postGetAllAction
    },
    {
        path: "/api/posts/:id",
        method: "get",
        action: PostGetByIdAction_1.postGetByIdAction
    },
    {
        path: "/api/posts",
        method: "post",
        action: PostSaveAction_1.postSaveAction
    },
    {
        path: "/api/courses",
        method: "get",
        action: CourseGetAllAction_1.courseGetAllAction
    },
    {
        path: "/api/coursesWithLessons",
        method: "get",
        action: CourseGetAllWithLessonsAction_1.courseGetAllWithLessonsAction
    },
    {
        path: "/api/courses/:id",
        method: "get",
        action: CourseGetByIdAction_1.courseGetByIdAction
    },
    {
        path: "/api/coursesByUrl/:courseUrl",
        method: "get",
        action: CourseGetByUrlAction_1.courseGetByUrlAction
    },
    {
        path: "/api/course",
        method: "post",
        action: CourseCreateAction_1.courseCreateAction
    },
    {
        path: "/api/course/:id",
        method: "put",
        action: CourseUpdateAction_1.courseUpdateAction
    },
    {
        path: "/api/course/:id",
        method: "delete",
        action: CourseDeleteAction_1.courseDeleteAction
    },
    {
        path: "/api/lessons",
        method: "get",
        action: LessonGetAllAction_1.lessonGetAllAction
    },
    {
        path: "/api/lessons/:courseId",
        method: "get",
        action: LessonGetByCourseIdAction_1.lessonGetByCourseIdAction
    },
    {
        path: "/api/learnir",
        method: "post",
        action: LearnIRCreateAction_1.learnIRCreateAction
    },
    {
        path: "/api/learnir/:id",
        method: "put",
        action: LearnIRUpdateAction_1.learnIRUpdateAction
    },
    {
        path: "/api/learnirs",
        method: "get",
        action: LearnIRGetAllAction_1.learnIRGetAllAction
    },
    {
        path: "/api/learnir/:id",
        method: "delete",
        action: LearnIRDeleteAction_1.learnIRDeleteAction
    },
    {
        path: "/api/IRSignal",
        method: "post",
        action: IRSignalCreateAction_1.IRSignalCreateAction
    },
    {
        path: "/api/IRSignal/:id",
        method: "put",
        action: IRSignalUpdateAction_1.IRSignalUpdateAction
    },
    {
        path: "/api/IRSignals",
        method: "get",
        action: IRSignalGetAllAction_1.IRSignalGetAllAction
    },
    {
        path: "/api/IRSignal/:id",
        method: "delete",
        action: IRSignalDeleteAction_1.IRSignalDeleteAction
    },
    {
        path: "/api/remoteDash",
        method: "post",
        action: RemoteDashCreateAction_1.remoteDashCreateAction
    },
    {
        path: "/api/remoteDash/:id",
        method: "put",
        action: RemoteDashUpdateAction_1.remoteDashUpdateAction
    },
    {
        path: "/api/remoteDashes",
        method: "get",
        action: RemoteDashGetAllAction_1.remoteDashGetAllAction
    },
    {
        path: "/api/remoteDash/:id",
        method: "delete",
        action: RemoteDashDeleteAction_1.remoteDashDeleteAction
    },
];
//# sourceMappingURL=routes.js.map