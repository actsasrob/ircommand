

import {Request, Response} from 'express';
import {REMOTE_DASHES} from "./db-data";



export function getAllRemoteDashes(req: Request, res: Response) {

    console.log("Retrieving remoteDashes data ...");

    setTimeout(() => {

      res.status(200).json({payload:Object.values(REMOTE_DASHES)});

    }, 1000);



}


export function getRemoteDashByUrl(req: Request, res: Response) {

    const remoteDashUrl = req.params["remoteDashUrl"];

    const remoteDashes:any = Object.values(REMOTE_DASHES);

    const remoteDash = remoteDashes.find(remoteDash => remoteDash.url == remoteDashUrl);

    setTimeout(() => {

      res.status(200).json(remoteDash);

    }, 1000);


}
