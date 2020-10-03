import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {RemoteDash} from '../model/remote-dash';


@Injectable()
export class RemoteDashEntityService
    extends EntityCollectionServiceBase<RemoteDash> {

    constructor(
        serviceElementsFactory:
            EntityCollectionServiceElementsFactory) {

        super('RemoteDash', serviceElementsFactory);

    }

}

