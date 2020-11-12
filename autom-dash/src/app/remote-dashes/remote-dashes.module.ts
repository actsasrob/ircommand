import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {RemoteDashesCardListComponent} from './remote-dashes-card-list/remote-dashes-card-list.component';
import {EditRemoteDashDialogComponent} from './edit-remote-dash-dialog/edit-remote-dash-dialog.component';
import {EditButtonItemDialogComponent} from './edit-button-item-dialog/edit-button-item-dialog.component';
import {RemoteDashComponent} from './remote-dash/remote-dash.component';
import {ButtonItemComponent} from './components/button-item.component';
import {GenericItemComponent} from './components/generic-item.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {ReactiveFormsModule} from '@angular/forms';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {EntityDataService, EntityDefinitionService, EntityMetadataMap} from '@ngrx/data';
import {compareRemoteDashes, RemoteDash} from './model/remote-dash';

import {RemoteDashEntityService} from './services/remote-dash-entity.service';
import {RemoteDashesResolver} from './services/remote-dashes.resolver';
import {RemoteDashesDataService} from './services/remote-dashes-data.service';
import {RemoteDashLayoutService} from './services/remote-dash-layout.service';
import {LearnIREntityService} from '../shared/services/learn-ir-entity.service';
import {LearnIRsResolver} from '../shared/services/learn-irs.resolver';
import {compareLearnIRs,LearnIR} from '../learn-irs/model/learn-ir';
import {IRSignalEntityService} from '../shared/services/ir-signal-entity.service';
import {IRSignalsResolver} from '../shared/services/ir-signals.resolver';
import {compareIRSignals,IRSignal} from '../ir-signals/model/ir-signal';
import { GridsterModule } from 'angular-gridster2'; 


import { RemoteDashLayoutItemDirective } from '../directives/remote-dash-layout-item.directive';

import { RIBannerComponent } from './components/ri-banner.component';
import { RIDirective } from './directives/ri.directive';

export const RemoteDashesRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            RemoteDashes: RemoteDashesResolver
        }
    },
    {
        path: ':RemoteDashUrl',
        component: RemoteDashComponent,
        resolve: {
            RemoteDashes: RemoteDashesResolver,
            LearnIRs: LearnIRsResolver,
            IRSignals: IRSignalsResolver
        }
    }
];

const entityMetadata: EntityMetadataMap = {
    RemoteDash: {
        sortComparer: compareRemoteDashes,
        //entityDispatcherOptions: {
        //    optimisticUpdate: true
        //}
    },
    LearnIR: {
        sortComparer: compareLearnIRs 
    },
    IRSignal: {
        sortComparer: compareIRSignals 
    }
};


@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        GridsterModule, 
        RouterModule.forChild(RemoteDashesRoutes),
        SharedModule
    ],
    declarations: [
        HomeComponent,
        RemoteDashesCardListComponent,
        EditRemoteDashDialogComponent,
        EditButtonItemDialogComponent,
        RemoteDashComponent,
        RemoteDashLayoutItemDirective,
        RIBannerComponent,
        RIDirective,
        ButtonItemComponent, 
        GenericItemComponent 
    ],
    exports: [
        HomeComponent,
        RemoteDashesCardListComponent,

        EditRemoteDashDialogComponent,
        RemoteDashComponent
    ],
    entryComponents: [EditRemoteDashDialogComponent],
    providers: [
        RemoteDashEntityService,
        RemoteDashesResolver,
        RemoteDashesDataService,
        RemoteDashLayoutService,
    ]
})
export class RemoteDashesModule {

    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private RemoteDashesDataService: RemoteDashesDataService) {

        eds.registerMetadataMap(entityMetadata);

        entityDataService.registerService('RemoteDash', RemoteDashesDataService);

    }


}
