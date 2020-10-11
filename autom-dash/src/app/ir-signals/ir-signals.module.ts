import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {IRSignalsCardListComponent} from './ir-signals-card-list/ir-signals-card-list.component';
import {EditIRSignalDialogComponent} from './edit-ir-signal-dialog/edit-ir-signal-dialog.component';
//import {IRSignalsHttpService} from './services/ir-signals-http.service';
import {IRSignalComponent} from './ir-signal/ir-signal.component';
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
import {EntityDataService, EntityDefinitionService, EntityMetadataMap} from '@ngrx/data';
import {compareIRSignals, IRSignal} from './model/ir-signal';

import {IRSignalEntityService} from './services/ir-signal-entity.service';
import {IRSignalsResolver} from './services/ir-signals.resolver';
import {IRSignalsDataService} from './services/ir-signals-data.service';


export const IRSignalsRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            IRSignals: IRSignalsResolver
        }
    },
    {
        path: ':IRSignalUrl',
        component: IRSignalComponent,
        resolve: {
            IRSignals: IRSignalsResolver
        }
    }
];

const entityMetadata: EntityMetadataMap = {
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
        RouterModule.forChild(IRSignalsRoutes)
    ],
    declarations: [
        HomeComponent,
        IRSignalsCardListComponent,
        EditIRSignalDialogComponent,
        IRSignalComponent
    ],
    exports: [
        HomeComponent,
        IRSignalsCardListComponent,

        EditIRSignalDialogComponent,
        IRSignalComponent
    ],
    entryComponents: [EditIRSignalDialogComponent],
    providers: [
        //IRSignalsHttpService,
        IRSignalEntityService,
        IRSignalsResolver,
        IRSignalsDataService
    ]
})
export class IRSignalsModule {

    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private IRSignalsDataService: IRSignalsDataService) {

        eds.registerMetadataMap(entityMetadata);

        entityDataService.registerService('IRSignal', IRSignalsDataService);

    }


}
