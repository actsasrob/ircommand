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
import { HostListener  } from "@angular/core";


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

    defaultTouch = { x: 0, y: 0, time: 0 };

    public event: MouseEvent;
    public clientX = 0;
    public clientY = 0;

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
        //console.log("ButtonItem.ngOnInit(): here1 this.data=" + JSON.stringify(this.data));
        this.IRSignal$ = this.IRSignalsService.entities$
            .pipe(
                map(IRSignals => IRSignals.find(IRSignal => IRSignal.id == parseInt(this.data.IRSignalId)))
        );

        if (this.data.IRSignalId) {
        //console.log("ButtonItem.ngOnInit(): here1");
        this.IRSignal$.subscribe(
            IRSignal => {
              //console.log("ButtonItem.ngOnInit(): IRSignal=" + JSON.stringify(IRSignal));
            }
        );
        }
        //console.log("ButtonItem.ngOnInit(): here2");
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

    @HostListener('click', ['$event'])
    onClick(event: any) {
       //console.log("ButtonItem.onClick(): " + JSON.stringify(event));
       console.log("ButtonItem.onClick(): " + event.target);
        if (this.data.IRSignalId) {
           //console.log("ButtonItem.ngOnInit(): here1");
           this.IRSignal$.subscribe(
               IRSignal => {
                 //console.log("ButtonItem.ngOnInit(): IRSignal=" + JSON.stringify(IRSignal));
                 const tmpData: string = `{ "signal": "${IRSignal.signal}" }`;
                 this.messageService.sendIRSignal(tmpData);
               }
           );
        }
    }

    //private onClick() {
    //  console.log('ButtonItem.onClick()');
    //}

      onEvent(event: MouseEvent): void {
          console.log("ButtonItem.onEvent()");
          this.event = event;
      }

      coordinates(event: MouseEvent): void {
          this.clientX = event.clientX;
          this.clientY = event.clientY;
      }

    @HostListener('touchstart', ['$event'])
    //@HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event) {
        console.log("ButtonItem.handleTouch()");
        let touch = event.touches[0] || event.changedTouches[0];

        // check the events
        if (event.type === 'touchstart') {
            this.defaultTouch.x = touch.pageX;
            this.defaultTouch.y = touch.pageY;
            this.defaultTouch.time = event.timeStamp;
        } else if (event.type === 'touchend') {
            let deltaX = touch.pageX - this.defaultTouch.x;
            let deltaY = touch.pageY - this.defaultTouch.y;
            let deltaTime = event.timeStamp - this.defaultTouch.time;

            // simulte a swipe -> less than 500 ms and more than 60 px
            if (deltaTime < 500) {
                // touch movement lasted less than 500 ms
                if (Math.abs(deltaX) > 60) {
                    // delta x is at least 60 pixels
                    if (deltaX > 0) {
                        this.doSwipeRight(event);
                    } else {
                        this.doSwipeLeft(event);
                    }
                }

                if (Math.abs(deltaY) > 60) {
                    // delta y is at least 60 pixels
                    if (deltaY > 0) {
                        this.doSwipeDown(event);
                    } else {
                        this.doSwipeUp(event);
                    }
                }
            }
        }
    }

    doSwipeLeft(event) {
        console.log('swipe left', event);
    }

    doSwipeRight(event) {
        console.log('swipe right', event);
    }

    doSwipeUp(event) {
        console.log('swipe up', event);
    }

    doSwipeDown(event) {
        console.log('swipe down', event);
    }
}

