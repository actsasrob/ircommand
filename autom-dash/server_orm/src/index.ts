import "reflect-metadata";
import {createConnection} from "typeorm";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {AppRoutes} from "./routes";
import * as fs from 'fs';
import * as https from 'https';

import {Application} from "express";
import {readAllLessons} from "./controller/read-all-lessons.route";
import {createUser} from "./controller/create-user.route";
import {getUser} from "./controller/get-user.route";
import {logout} from "./controller/logout.route";
import {login} from "./controller/login.route";
import {retrieveUserIdFromRequest} from "./controller/get-user.middleware";
import {checkIfAuthenticated} from "./controller/authentication.middleware";
import {checkCsrfToken} from "./controller/csrf.middleware";
import {checkIfAuthorized} from "./controller/authorization.middleware";
import * as _ from 'lodash';
import {loginAsUser} from "./controller/login-as-user.route";
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const express = require('express')

import {loginUserAction} from "./controller/LoginUserAction";
import {signupUserAction} from "./controller/SignupUserAction";
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

const SERVER_PORT=9000;

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(cookieParser());
    app.use(retrieveUserIdFromRequest);
    app.use(bodyParser.json());

    const commandLineArgs = require('command-line-args');
    
    const optionDefinitions = [
        { name: 'secure', type: Boolean,  defaultOption: false },
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
    .post(checkIfAuthenticated,
          _.partial(checkIfAuthorized, ['USER']),
          learnIRCreateAction);

    app.route('/api/learnir/:id')
    .put(checkIfAuthenticated,
          _.partial(checkIfAuthorized, ['USER']),
          learnIRUpdateAction);

    app.route('/api/learnirs')
    .get(checkIfAuthenticated,
          _.partial(checkIfAuthorized, ['USER']),
          learnIRGetAllAction);

    app.route('/api/learnir/:id')
    .delete(checkIfAuthenticated,
          _.partial(checkIfAuthorized, ['USER']),
          learnIRDeleteAction);

    app.route('/api/IRSignal')
    .post(checkIfAuthenticated,
          _.partial(checkIfAuthorized, ['USER']),
          IRSignalCreateAction);

    app.route('/api/IRSignal/:id')
    .put(checkIfAuthenticated,
         _.partial(checkIfAuthorized, ['USER']),
         IRSignalUpdateAction);

    app.route('/api/IRSignals')
    .get(checkIfAuthenticated,
         _.partial(checkIfAuthorized, ['USER']),
         IRSignalGetAllAction);

    app.route('/api/IRSignal/:id')
    .delete(checkIfAuthenticated,
            _.partial(checkIfAuthorized, ['USER']),
            IRSignalDeleteAction);

    app.route('/api/remoteDash')
    .post(checkIfAuthenticated,
          _.partial(checkIfAuthorized, ['USER']),
          remoteDashCreateAction);

    app.route('/api/remoteDash/:id')
    .put(checkIfAuthenticated,
         _.partial(checkIfAuthorized, ['USER']),
         remoteDashUpdateAction);

    app.route('/api/remoteDashes')
    .get(checkIfAuthenticated,
         _.partial(checkIfAuthorized, ['USER']),
         remoteDashGetAllAction);

    app.route('/api/remoteDash/:id')
    .delete(checkIfAuthenticated,
            _.partial(checkIfAuthorized, ['USER']),
            remoteDashDeleteAction);

    app.route('/api/admin')
        .post(checkIfAuthenticated,
              _.partial(checkIfAuthorized,['ADMIN']),
              loginAsUser);
    
    app.route('/api/signup')
        .post(createUser);
    
    app.route('/api/user')
        .get(getUser);
    
    app.route('/api/logout')
        .post(checkIfAuthenticated, checkCsrfToken, logout);
    
    app.route('/api/login')
        .post(login);

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

}).catch(error => console.log("TypeORM connection error: ", error));
