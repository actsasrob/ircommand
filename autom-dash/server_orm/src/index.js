"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bodyParser = __importStar(require("body-parser"));
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
const create_user_route_1 = require("./controller/create-user.route");
const get_user_route_1 = require("./controller/get-user.route");
const logout_route_1 = require("./controller/logout.route");
const login_route_1 = require("./controller/login.route");
const get_user_middleware_1 = require("./controller/get-user.middleware");
const authentication_middleware_1 = require("./controller/authentication.middleware");
const csrf_middleware_1 = require("./controller/csrf.middleware");
const authorization_middleware_1 = require("./controller/authorization.middleware");
const _ = __importStar(require("lodash"));
const login_as_user_route_1 = require("./controller/login-as-user.route");
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
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
const SERVER_PORT = 9000;
// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
typeorm_1.createConnection().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    // create express app
    const app = express();
    app.use(cookieParser());
    app.use(get_user_middleware_1.retrieveUserIdFromRequest);
    app.use(bodyParser.json());
    const commandLineArgs = require('command-line-args');
    const optionDefinitions = [
        { name: 'secure', type: Boolean, defaultOption: false },
    ];
    const options = commandLineArgs(optionDefinitions);
    // register all application routes
    //AppRoutes.forEach(route => {
    //    app[route.method](route.path, (request: Request, response: Response, next: Function) => {
    //        route.action(request, response)
    //            .then(() => next)
    //            .catch(err => next(err));
    //    });
    //});
    //app.route('/api/login')
    //.post(loginUserAction);
    //app.route('/api/signup')
    //.post(signupUserAction);
    app.route('/api/learnir')
        .post(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), LearnIRCreateAction_1.learnIRCreateAction);
    app.route('/api/learnir/:id')
        .put(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), LearnIRUpdateAction_1.learnIRUpdateAction);
    app.route('/api/learnirs')
        .get(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), LearnIRGetAllAction_1.learnIRGetAllAction);
    app.route('/api/learnir/:id')
        .delete(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), LearnIRDeleteAction_1.learnIRDeleteAction);
    app.route('/api/IRSignal')
        .post(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), IRSignalCreateAction_1.IRSignalCreateAction);
    app.route('/api/IRSignal/:id')
        .put(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), IRSignalUpdateAction_1.IRSignalUpdateAction);
    app.route('/api/IRSignals')
        .get(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), IRSignalGetAllAction_1.IRSignalGetAllAction);
    app.route('/api/IRSignal/:id')
        .delete(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), IRSignalDeleteAction_1.IRSignalDeleteAction);
    app.route('/api/remoteDash')
        .post(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), RemoteDashCreateAction_1.remoteDashCreateAction);
    app.route('/api/remoteDash/:id')
        .put(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), RemoteDashUpdateAction_1.remoteDashUpdateAction);
    app.route('/api/remoteDashes')
        .get(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), RemoteDashGetAllAction_1.remoteDashGetAllAction);
    app.route('/api/remoteDash/:id')
        .delete(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['USER']), RemoteDashDeleteAction_1.remoteDashDeleteAction);
    app.route('/api/admin')
        .post(authentication_middleware_1.checkIfAuthenticated, _.partial(authorization_middleware_1.checkIfAuthorized, ['ADMIN']), login_as_user_route_1.loginAsUser);
    app.route('/api/signup')
        .post(create_user_route_1.createUser);
    app.route('/api/user')
        .get(get_user_route_1.getUser);
    app.route('/api/logout')
        .post(authentication_middleware_1.checkIfAuthenticated, csrf_middleware_1.checkCsrfToken, logout_route_1.logout);
    app.route('/api/login')
        .post(login_route_1.login);
    // run app
    if (options.secure) {
        const httpsServer = https.createServer({
            key: fs.readFileSync('automdash.com.key'),
            cert: fs.readFileSync('automdash.com.crt'),
            ca: fs.readFileSync('myCA.pem')
        }, app);
        // launch an HTTPS Server. Note: this does NOT mean that the application is secure
        httpsServer.listen(SERVER_PORT, () => console.log("HTTPS Secure Server running at https://localhost:" + SERVER_PORT));
    }
    else {
        // launch an HTTP Server
        const httpServer = app.listen(SERVER_PORT, () => {
            //console.log("HTTP Server running at https://localhost:" + httpServer.address().port);
            console.log("HTTP Server running at http://localhost:" + SERVER_PORT);
        });
    }
})).catch(error => console.log("TypeORM connection error: ", error));
//# sourceMappingURL=index.js.map