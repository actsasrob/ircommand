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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");
const LoginUserAction_1 = require("./controller/LoginUserAction");
const SignupUserAction_1 = require("./controller/SignupUserAction");
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
    app.route('/api/login')
        .post(LoginUserAction_1.loginUserAction);
    app.route('/api/signup')
        .post(SignupUserAction_1.signupUserAction);
    app.route('/api/learnir')
        .post(LearnIRCreateAction_1.learnIRCreateAction);
    app.route('/api/learnir/:id')
        .put(LearnIRUpdateAction_1.learnIRUpdateAction);
    app.route('/api/learnirs')
        .get(LearnIRGetAllAction_1.learnIRGetAllAction);
    app.route('/api/learnir/:id')
        .delete(LearnIRDeleteAction_1.learnIRDeleteAction);
    app.route('/api/IRSignal')
        .post(IRSignalCreateAction_1.IRSignalCreateAction);
    app.route('/api/IRSignal/:id')
        .put(IRSignalUpdateAction_1.IRSignalUpdateAction);
    app.route('/api/IRSignals')
        .get(IRSignalGetAllAction_1.IRSignalGetAllAction);
    app.route('/api/IRSignal/:id')
        .delete(IRSignalDeleteAction_1.IRSignalDeleteAction);
    app.route('/api/remoteDash')
        .post(RemoteDashCreateAction_1.remoteDashCreateAction);
    app.route('/api/remoteDash/:id')
        .put(RemoteDashUpdateAction_1.remoteDashUpdateAction);
    app.route('/api/remoteDashes')
        .get(RemoteDashGetAllAction_1.remoteDashGetAllAction);
    app.route('/api/remoteDash/:id')
        .delete(RemoteDashDeleteAction_1.remoteDashDeleteAction);
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