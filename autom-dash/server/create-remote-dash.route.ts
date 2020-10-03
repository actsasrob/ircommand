import {Request, Response} from 'express';
import {REMOTE_DASHES} from './db-data';

export var remoteDashesKeyCounter = 100;

export function createRemoteDash(req: Request, res: Response) {

    console.log("Creating new remoteDash ...");

    const changes = req.body;

    const newRemoteDash = {
        id: remoteDashesKeyCounter,
      seqNo: remoteDashesKeyCounter,
        ...changes
    };

  REMOTE_DASHES[newRemoteDash.id] = newRemoteDash;

  remoteDashesKeyCounter += 1;

    setTimeout(() => {

      res.status(200).json(newRemoteDash);

    }, 2000);

}

