import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EntityDataService, EntityDefinitionService, EntityMetadataMap} from '@ngrx/data';
import {LearnIREntityService} from './services/learn-ir-entity.service';
import {LearnIRsResolver} from './services/learn-irs.resolver';
import {LearnIRsDataService} from './services/learn-irs-data.service';

import {compareLearnIRs, LearnIR} from '../learn-irs/model/learn-ir';

const entityMetadata: EntityMetadataMap = {
    LearnIR: {
        sortComparer: compareLearnIRs,
        entityDispatcherOptions: {
            optimisticUpdate: true
        }
    },
};

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [],
    providers: [
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
               LearnIREntityService,
               LearnIRsResolver,
               LearnIRsDataService
            ]
        }
    }
    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private learnIRsDataService: LearnIRsDataService) {

        eds.registerMetadataMap(entityMetadata);

        entityDataService.registerService('LearnIR', learnIRsDataService);

    }
}
