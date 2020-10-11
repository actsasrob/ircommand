import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {LearnIRsCardListComponent} from './learn-irs-card-list/learn-irs-card-list.component';
import {EditLearnIRDialogComponent} from './edit-learn-ir-dialog/edit-learn-ir-dialog.component';
//import {LearnIRsHttpService} from './services/learn-irs-http.service';
import {LearnIRComponent} from './learn-ir/learn-ir.component';
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
import {compareLearnIRs, LearnIR} from './model/learn-ir';

import {compareLessons, Lesson} from './model/lesson';
import {LearnIREntityService} from './services/learn-ir-entity.service';
import {LearnIRsResolver} from './services/learn-irs.resolver';
import {LearnIRsDataService} from './services/learn-irs-data.service';
import {LessonEntityService} from './services/lesson-entity.service';


export const learnIRsRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            learnIRs: LearnIRsResolver
        }
    },
    {
        path: ':learnIRUrl',
        component: LearnIRComponent,
        resolve: {
            learnIRs: LearnIRsResolver
        }
    }
];

const entityMetadata: EntityMetadataMap = {
    LearnIR: {
        sortComparer: compareLearnIRs,
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
        RouterModule.forChild(learnIRsRoutes)
    ],
    declarations: [
        HomeComponent,
        LearnIRsCardListComponent,
        EditLearnIRDialogComponent,
        LearnIRComponent
    ],
    exports: [
        HomeComponent,
        LearnIRsCardListComponent,

        EditLearnIRDialogComponent,
        LearnIRComponent
    ],
    entryComponents: [EditLearnIRDialogComponent],
    providers: [
        //LearnIRsHttpService,
        LearnIREntityService,
        LessonEntityService,
        LearnIRsResolver,
        LearnIRsDataService
    ]
})
export class LearnIRsModule {

    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private learnIRsDataService: LearnIRsDataService) {

        eds.registerMetadataMap(entityMetadata);

        entityDataService.registerService('LearnIR', learnIRsDataService);

    }


}
