import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {LearnIR} from '../model/learn-ir';


@Injectable()
export class LearnIREntityService
    extends EntityCollectionServiceBase<LearnIR> {

    constructor(
        serviceElementsFactory:
            EntityCollectionServiceElementsFactory) {

        super('LearnIR', serviceElementsFactory);

    }

}

