import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import {Observable} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditButtonItemDialogComponent} from "../edit-button-item-dialog/edit-button-item-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';

import {select, Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import { EntityCollectionServiceFactory,EntityCollectionService, EntityServices, EntityAction, EntityActionFactory, EntityOp } from '@ngrx/data';
import {IRSignal} from '../../ir-signals/model/ir-signal';
import {IRSignalEntityService} from '../../shared/services/ir-signal-entity.service';

import { RIComponent } from './ri.component';

import {RemoteDashItemMessageService} from '../services/remote-dash-item-message.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-button-item',
  template: `
    <div class="app-button-item">
      <div class="app-button-item-irsignal" *ngIf="(IRSignal$ | async) as IRSignal; else elseBlock">
         <div class="spinner-container" *ngIf="(loading$ | async )">
           <mat-spinner></mat-spinner>
         </div>
         <h2>Name: {{IRSignal?.name}}</h2>
         IR Signal
         <p>{{IRSignal?.signal}}</p>
      </div>
      <ng-template #elseBlock>
         <p>Please click the Edit button to select an IR Signal</p>
      </ng-template>

      <button
      (click)="editItem(data)"
      >
        Edit Item
      </button>
    </div>
  `
})
export class ButtonItemComponent implements OnInit, RIComponent {
    @Input() data: any;

    subscription: Subscription;

    IRSignalsService: EntityCollectionService<IRSignal>; 
    entityActionFactory: EntityActionFactory; 
    IRSignal$: Observable<IRSignal>;
    loading$: Observable<boolean>;
    myData: any;

    constructor(
      private store: Store<AppState>,
      private dialog: MatDialog,
      private messageService: RemoteDashItemMessageService,
      EntityCollectionServiceFactory: EntityCollectionServiceFactory) {
         this.subscription = messageService.toChildren$.subscribe(
           message => {
      });      
      this.entityActionFactory = new EntityActionFactory();
      this.IRSignalsService = EntityCollectionServiceFactory.create<IRSignal>('IRSignal');
    }
 
    ngOnInit() {
        console.log("ButtonItem.ngOnInit(): here1 this.data=" + JSON.stringify(this.data));
        this.IRSignal$ = this.IRSignalsService.entities$
            .pipe(
                map(IRSignals => IRSignals.find(IRSignal => IRSignal.id == parseInt(this.data.IRSignalId)))
        );

        if (this.data.IRSignalId) {
        console.log("ButtonItem.ngOnInit(): here1");
        this.IRSignal$.subscribe(
            IRSignal => {
              console.log("ButtonItem.ngOnInit(): IRSignal=" + JSON.stringify(IRSignal));
              this.myData = JSON.parse(JSON.stringify(IRSignal));
            }
        );
        }
        console.log("ButtonItem.ngOnInit(): here2");
    }

    ngOnDestroy() {
      // prevent memory leak when component destroyed
      this.subscription.unsubscribe();
    }

    editItem(data: any) {
       //console.log("ButtonItem.editItem()");
          const dialogConfig = defaultDialogConfig();

          dialogConfig.data = {
            dialogTitle:"Edit Button",
            data,
            mode: 'update'
          };

          this.dialog.open(EditButtonItemDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe( theData => {
               console.log("ButtonItem.editItem(): theData=" + JSON.stringify(theData));
               if (theData) {
                  this.messageService.receiveFromChildren(JSON.stringify(theData));
               }
            });
    }

}

