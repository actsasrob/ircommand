import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {IRSignal} from '../../ir-signals/model/ir-signal';


@Injectable()
export class IRSignalEntityService
    extends EntityCollectionServiceBase<IRSignal> {

    constructor(
        serviceElementsFactory:
            EntityCollectionServiceElementsFactory) {

        super('IRSignal', serviceElementsFactory);

    }

}

