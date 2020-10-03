

import * as express from 'express';
import {Application} from "express";
import {getAllRemoteDashes, getRemoteDashByUrl} from "./get-remote-dashes.route";
import {searchLessons} from "./search-lessons.route";
import {loginUser} from "./auth.route";
import {saveRemoteDash} from "./save-remote-dash.route";
import {createRemoteDash} from './create-remote-dash.route';
import {deleteRemoteDash} from './delete-remote-dash.route';

const bodyParser = require('body-parser');



const app: Application = express();


app.use(bodyParser.json());


app.route('/api/login').post(loginUser);

app.route('/api/remoteDashes').get(getAllRemoteDashes);

app.route('/api/remoteDash').post(createRemoteDash);

app.route('/api/remoteDash/:id').put(saveRemoteDash);

app.route('/api/remoteDash/:id').delete(deleteRemoteDash);

app.route('/api/remoteDashes/:remoteDashUrl').get(getRemoteDashByUrl);

app.route('/api/lessons').get(searchLessons);




const httpServer:any = app.listen(9001, () => {
    console.log("HTTP REST API Server running at http://localhost:" + httpServer.address().port);
});




