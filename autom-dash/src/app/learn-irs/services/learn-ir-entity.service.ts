import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {LearnIR} from '../model/learn-ir';


@Injectable({ providedIn: 'root'})
export class LearnIREntityService
    extends EntityCollectionServiceBase<LearnIR> {

    constructor(
        serviceElementsFactory:
            EntityCollectionServiceElementsFactory) {

        super('LearnIR', serviceElementsFactory);

    }

}

