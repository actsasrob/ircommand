import {postGetAllAction} from "./controller/PostGetAllAction";
import {postGetByIdAction} from "./controller/PostGetByIdAction";
import {postSaveAction} from "./controller/PostSaveAction";
import {loginUserAction} from "./controller/LoginUserAction";
import {signupUserAction} from "./controller/SignupUserAction";
import {courseGetAllAction} from "./controller/CourseGetAllAction";
import {courseGetAllWithLessonsAction} from "./controller/CourseGetAllWithLessonsAction";
import {courseGetByIdAction} from "./controller/CourseGetByIdAction";
import {courseGetByUrlAction} from "./controller/CourseGetByUrlAction";
import {courseCreateAction} from "./controller/CourseCreateAction";
import {courseUpdateAction} from "./controller/CourseUpdateAction";
import {courseDeleteAction} from "./controller/CourseDeleteAction";
import {lessonGetAllAction} from "./controller/LessonGetAllAction";
import {lessonGetByCourseIdAction} from "./controller/LessonGetByCourseIdAction";
import {learnIRGetAllAction} from "./controller/LearnIRGetAllAction";
import {learnIRCreateAction} from "./controller/LearnIRCreateAction";
import {learnIRUpdateAction} from "./controller/LearnIRUpdateAction";
import {learnIRDeleteAction} from "./controller/LearnIRDeleteAction";
import {IRSignalGetAllAction} from "./controller/IRSignalGetAllAction";
import {IRSignalCreateAction} from "./controller/IRSignalCreateAction";
import {IRSignalUpdateAction} from "./controller/IRSignalUpdateAction";
import {IRSignalDeleteAction} from "./controller/IRSignalDeleteAction";
import {remoteDashGetAllAction} from "./controller/RemoteDashGetAllAction";
import {remoteDashCreateAction} from "./controller/RemoteDashCreateAction";
import {remoteDashUpdateAction} from "./controller/RemoteDashUpdateAction";
import {remoteDashDeleteAction} from "./controller/RemoteDashDeleteAction";

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/api/login",
        method: "post",
        action: loginUserAction 
    },
    {
        path: "/api/signup",
        method: "post",
        action: signupUserAction 
    },
    {
        path: "/api/posts",
        method: "get",
        action: postGetAllAction
    },
    {
        path: "/api/posts/:id",
        method: "get",
        action: postGetByIdAction
    },
    {
        path: "/api/posts",
        method: "post",
        action: postSaveAction
    },
    {
        path: "/api/courses",
        method: "get",
        action: courseGetAllAction
    },
    {
        path: "/api/coursesWithLessons",
        method: "get",
        action: courseGetAllWithLessonsAction
    },
    {
        path: "/api/courses/:id",
        method: "get",
        action: courseGetByIdAction 
    },
    {
        path: "/api/coursesByUrl/:courseUrl",
        method: "get",
        action: courseGetByUrlAction 
    },
    {
        path: "/api/course",
        method: "post",
        action: courseCreateAction 
    },
    {
        path: "/api/course/:id",
        method: "put",
        action: courseUpdateAction 
    },
    {
        path: "/api/course/:id",
        method: "delete",
        action: courseDeleteAction
    },
    {
        path: "/api/lessons",
        method: "get",
        action: lessonGetAllAction 
    },
    {
        path: "/api/lessons/:courseId",
        method: "get",
        action: lessonGetByCourseIdAction 
    },
    {
        path: "/api/learnir",
        method: "post",
        action: learnIRCreateAction
    },
    {
        path: "/api/learnir/:id",
        method: "put",
        action: learnIRUpdateAction
    },
    {
        path: "/api/learnirs",
        method: "get",
        action: learnIRGetAllAction
    },
    {
        path: "/api/learnir/:id",
        method: "delete",
        action: learnIRDeleteAction
    },
    {
        path: "/api/IRSignal",
        method: "post",
        action: IRSignalCreateAction
    },
    {
        path: "/api/IRSignal/:id",
        method: "put",
        action: IRSignalUpdateAction
    },
    {
        path: "/api/IRSignals",
        method: "get",
        action: IRSignalGetAllAction
    },
    {
        path: "/api/IRSignal/:id",
        method: "delete",
        action: IRSignalDeleteAction
    },
    {
        path: "/api/remoteDash",
        method: "post",
        action: remoteDashCreateAction
    },
    {
        path: "/api/remoteDash/:id",
        method: "put",
        action: remoteDashUpdateAction
    },
    {
        path: "/api/remoteDashes",
        method: "get",
        action: remoteDashGetAllAction
    },
    {
        path: "/api/remoteDash/:id",
        method: "delete",
        action: remoteDashDeleteAction
    },

];
