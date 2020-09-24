import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NGXLogger } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { Example1Component } from './components/example1/example1.component';
import { Example2Component } from './components/example2/example2.component';
import { LayoutItemDirective } from './directives/layout-item.directive';
//import { NGXLogger } from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    Example1Component,
    Example2Component,
    LayoutItemDirective
  ],
  imports: [
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF}),
    BrowserModule,
    AppRoutingModule,
    GridsterModule,
  ],
  providers:[],
  bootstrap: [AppComponent]
})
export class AppModule { }

entryComponents: [
  Example1Component,
  Example2Component
]
