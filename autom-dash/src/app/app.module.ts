import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {HttpClientModule} from '@angular/common/http';

import {RouterModule, Routes} from '@angular/router';
import {AuthModule} from './auth/auth.module';
import {SharedModule} from './shared/shared.module';
//import {LearnIRsModule} from './learn-irs/learn-irs.module';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {RouterState, StoreRouterConnectingModule} from '@ngrx/router-store';

import {EffectsModule} from '@ngrx/effects';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {metaReducers, reducers} from './reducers';
import {AuthGuard} from './auth/auth.guard';
import {EntityDataModule} from '@ngrx/data'

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { GridsterModule } from 'angular-gridster2';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { NGXLogger } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { Example1Component } from './components/example1/example1.component';
import { Example2Component } from './components/example2/example2.component';
import { LayoutItemDirective } from './directives/layout-item.directive';
import { LearnirsComponent } from './components/learnirs/learnirs.component';
import { LearnirDetailComponent } from './components/learnir-detail/learnir-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
//import { AuthComponent } from './components/dashboard/dashboard.component';
import { entityConfig } from './entity-metadata';

const routes: Routes = [
    {
        path: 'courses',
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
        canActivate: [AuthGuard]
    },
    { 
        path: 'layout', 
        component: LayoutComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'remoteDashes',
        loadChildren: () => import('./remote-dashes/remote-dashes.module').then(m => m.RemoteDashesModule),
        canActivate: [AuthGuard]
    },
    { path: 'learnIRs', 
      loadChildren: () => import('./learn-irs/learn-irs.module').then(m => m.LearnIRsModule),
      canActivate: [ AuthGuard]
    },
    { path: 'IRSignals', 
      loadChildren: () => import('./ir-signals/ir-signals.module').then(m => m.IRSignalsModule),
      canActivate: [ AuthGuard]
    },
    { path: 'learnIRsold', component: LearnirsComponent,
      canActivate: [ AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    Example1Component,
    Example2Component,
    LayoutItemDirective,
    LearnirsComponent,
    LearnirDetailComponent,
    DashboardComponent
  ],
  imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatToolbarModule,
        AuthModule.forRoot(),
        SharedModule.forRoot(),
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks : {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictActionSerializability: true,
                strictStateSerializability:true
            }
        }),
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot({}),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router',
            routerState: RouterState.Minimal
        }),

    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF}),
    GridsterModule,
  ],
  providers: [
],
  bootstrap: [AppComponent]
})
export class AppModule { }

entryComponents: [
  Example1Component,
  Example2Component
]
