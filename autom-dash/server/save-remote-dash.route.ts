import {Request, Response} from 'express';
import {REMOTE_DASHES} from "./db-data";


export function saveRemoteDash(req: Request, res: Response) {

    console.log("Saving remoteDash ...");

    const id = req.params["id"],
        changes = req.body;

    REMOTE_DASHES[id] = {
        ...REMOTE_DASHES[id],
        ...changes
    };

    setTimeout(() => {

      res.status(200).json(REMOTE_DASHES[id]);

    }, 2000);

}

