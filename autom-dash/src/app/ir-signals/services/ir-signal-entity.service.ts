import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {IRSignal} from '../model/ir-signal';


@Injectable()
export class IRSignalEntityService
    extends EntityCollectionServiceBase<IRSignal> {

    constructor(
        serviceElementsFactory:
            EntityCollectionServiceElementsFactory) {

        super('IRSignal', serviceElementsFactory);

    }

}

