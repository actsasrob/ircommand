import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {RemoteDashesCardListComponent} from './remote-dashes-card-list/remote-dashes-card-list.component';
import {EditRemoteDashDialogComponent} from './edit-remote-dash-dialog/edit-remote-dash-dialog.component';
import {RemoteDashesHttpService} from './services/remote-dashes-http.service';
import {RemoteDashComponent} from './remote-dash/remote-dash.component';
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
import {compareRemoteDashes, RemoteDash} from './model/remote-dash';

import {compareLessons, Lesson} from './model/lesson';
import {RemoteDashEntityService} from './services/remote-dash-entity.service';
import {RemoteDashesResolver} from './services/remote-dashes.resolver';
import {RemoteDashesDataService} from './services/remote-dashes-data.service';
import {LessonEntityService} from './services/lesson-entity.service';


export const remoteDashesRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            remoteDashes: RemoteDashesResolver
        }
    },
    {
        path: ':remoteDashUrl',
        component: RemoteDashComponent,
        resolve: {
            remoteDashes: RemoteDashesResolver
        }
    }
];

const entityMetadata: EntityMetadataMap = {
    RemoteDash: {
        sortComparer: compareRemoteDashes,
        entityDispatcherOptions: {
            optimisticUpdate: true
        }
    },
    Lesson: {
        sortComparer: compareLessons
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
        RouterModule.forChild(remoteDashesRoutes)
    ],
    declarations: [
        HomeComponent,
        RemoteDashesCardListComponent,
        EditRemoteDashDialogComponent,
        RemoteDashComponent
    ],
    exports: [
        HomeComponent,
        RemoteDashesCardListComponent,

        EditRemoteDashDialogComponent,
        RemoteDashComponent
    ],
    entryComponents: [EditRemoteDashDialogComponent],
    providers: [
        RemoteDashesHttpService,
        RemoteDashEntityService,
        LessonEntityService,
        RemoteDashesResolver,
        RemoteDashesDataService
    ]
})
export class RemoteDashesModule {

    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private remoteDashesDataService: RemoteDashesDataService) {

        eds.registerMetadataMap(entityMetadata);

        entityDataService.registerService('RemoteDash', remoteDashesDataService);

    }


}
