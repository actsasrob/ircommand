import {Request, Response} from 'express';
import {REMOTE_DASHES} from "./db-data";


export function deleteRemoteDash(req: Request, res: Response) {

    console.log("Deleting remoteDash ...");

    const id = req.params["id"];

    const remoteDash = REMOTE_DASHES[id];

    delete REMOTE_DASHES[id];

    setTimeout(() => {

      res.status(200).json({id});

    }, 2000);

}

