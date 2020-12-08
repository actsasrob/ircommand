import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EntityDataService, EntityDefinitionService, EntityMetadataMap} from '@ngrx/data';
import {LearnIREntityService} from './services/learn-ir-entity.service';
import {LearnIRsResolver} from './services/learn-irs.resolver';
import {LearnIRsDataService} from './services/learn-irs-data.service';
import {compareLearnIRs, LearnIR} from '../learn-irs/model/learn-ir';

import {IRSignalEntityService} from './services/ir-signal-entity.service';
import {IRSignalsResolver} from './services/ir-signals.resolver';
import {IRSignalsDataService} from './services/ir-signals-data.service';
import {compareIRSignals, IRSignal} from '../ir-signals/model/ir-signal';

import {LayoutService} from './services/layout.service';
import {AlexaMetadataService} from './services/alexa-metadata.service';

const entityMetadata: EntityMetadataMap = {
    LearnIR: {
        sortComparer: compareLearnIRs,
        entityDispatcherOptions: {
            optimisticUpdate: true
        }
    },
    IRSignal: {
        sortComparer: compareIRSignals,
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
               LearnIRsDataService,
               IRSignalEntityService,
               IRSignalsResolver,
               IRSignalsDataService,
               LayoutService,
               AlexaMetadataService,
            ]
        }
    }
    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private learnIRsDataService: LearnIRsDataService,
        private irSignalsDataService: IRSignalsDataService
        ) {

        eds.registerMetadataMap(entityMetadata);

        entityDataService.registerService('LearnIR', learnIRsDataService);
        entityDataService.registerService('IRSignal', irSignalsDataService);

    }
}
