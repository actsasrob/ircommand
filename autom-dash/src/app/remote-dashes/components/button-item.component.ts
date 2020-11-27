import { Component, ChangeDetectionStrategy, Input, Output, OnInit, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
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
    <div id="4" class="app-button-item" >
      <div id="1" class="app-button-item-irsignal" (click)="onClick($event, data)" *ngIf="(IRSignal$ | async) as IRSignal; else elseBlock">
         <div class="spinner-container" *ngIf="(loading$ | async )">
           <mat-spinner></mat-spinner>
         </div>
         <br/>
         <h4>{{IRSignal?.name}}</h4>
         <!--
         IR Signal
         <p>{{IRSignal?.signal}}</p>
         -->
      </div>
      <ng-template #elseBlock>
         <p>Please click the Edit button to select an IR Signal</p>
      </ng-template>
      <div id="2" class="app-button-item-contols"> 
         <button (click)="onClick($event, data)"
         >
           Edit Item
         </button>
        <br><br>
      </div>
    </div>
  `,
    //changeDetection: ChangeDetectionStrategy.OnPush
}
    )
export class ButtonItemComponent implements OnInit, OnChanges, OnDestroy, RIComponent {
    @Input() data: any;

    subscription: Subscription;

    IRSignalsService: EntityCollectionService<IRSignal>; 
    entityActionFactory: EntityActionFactory; 
    IRSignal$: Observable<IRSignal>;
    loading$: Observable<boolean>;

    selectedSignal: string;

    defaultTouch = { x: 0, y: 0, time: 0 };

    public event: MouseEvent;
    public clientX = 0;
    public clientY = 0;

    constructor(
      private ref: ChangeDetectorRef,
      private store: Store<AppState>,
      private dialog: MatDialog,
      private messageService: RemoteDashItemMessageService,
      EntityCollectionServiceFactory: EntityCollectionServiceFactory) {
         this.subscription = messageService.toChildren$.subscribe(
           message => {
             console.log("ButtonItem.messageService.toChildren$()");
             this.ref.markForCheck();
      });      
      this.entityActionFactory = new EntityActionFactory();
      this.IRSignalsService = EntityCollectionServiceFactory.create<IRSignal>('IRSignal');
    }
 
    ngOnInit() {
        console.log("ButtonItem.ngOnInit(): here1 this.data=" + JSON.stringify(this.data));
        this.reload();
        //this.IRSignal$ = this.IRSignalsService.entities$
        //    .pipe(
        //        map(IRSignals => IRSignals.find(IRSignal => IRSignal.id == parseInt(this.data.IRSignalId))),
        //);

        //if (this.data.IRSignalId) {
        //   //console.log("ButtonItem.ngOnInit(): here1");
        //   this.IRSignal$.subscribe(
        //      IRSignal => {
        //         console.log("ButtonItem.ngOnInit(): IRSignal=" + JSON.stringify(IRSignal));
        //         selectedSignal = IRSignal.signal;
        //      }
        //   );
        //}
        //this.IRSignal$.subscribe(
        //   IRSignal => {
        //      console.log("ButtonItem.ngOnInit(): IRSignal=" + JSON.stringify(IRSignal));
        //      if (IRSignal.signal) {
        //         this.selectedSignal = IRSignal.signal;
        //         console.log("ButtonItem.ngOnInit(): this.selectedSignal=" + this.selectedSignal);
        //      }
        //   }
        //);
        //console.log("ButtonItem.ngOnInit(): here2");
    }
  
    ngOnChanges(changes: SimpleChanges) {
       console.log("ButtonItem.ngOnChanges(): changes=" + JSON.stringify(changes));
       this.reload();
    }

    reload() {

        this.loading$ = this.IRSignalsService.loading$.pipe(delay(0));
        this.IRSignal$ = this.IRSignalsService.entities$
            .pipe(
                map(IRSignals => IRSignals.find(IRSignal => IRSignal.id == parseInt(this.data.IRSignalId))),
        );

        if (this.data.IRSignalId) {
           console.log("ButtonItem.reload(): here1 this.data=" + JSON.stringify(this.data));
           this.IRSignal$.subscribe(
              IRSignal => {
                 console.log("ButtonItem.reload(): IRSignal=" + JSON.stringify(IRSignal));
                 this.selectedSignal = IRSignal.signal;
              }
           );
        }
        //this.IRSignal$.subscribe(
        //   IRSignal => {
        //      console.log("ButtonItem.reload(): IRSignal=" + JSON.stringify(IRSignal));
        //      if (IRSignal.signal) {
        //         this.selectedSignal = IRSignal.signal;
        //         console.log("ButtonItem.reload(): this.selectedSignal=" + this.selectedSignal);
        //      }
        //   }
        //);
    }

    ngOnDestroy() {
      // prevent memory leak when component destroyed
      console.log("ButtonItem.ngOnDestroy()");
      this.subscription.unsubscribe();
    }


    //@HostListener('click', ['$event'])
    //onClick(event: any) {
      onClick(event: Event, data: any) {
       event.stopPropagation();
       event.preventDefault();

        console.log("ButtonItem.onClick(): event=" + event + "event.target=" + event.target + "event.srcElement" + event.srcElement);
        let tmpString: string = event.target.toString();
        if (tmpString.includes("HTMLButtonElement")) {
          const dialogConfig = defaultDialogConfig();

          dialogConfig.data = {
            dialogTitle:"Edit Button",
            data,
            mode: 'update'
          };
          console.log("ButtonItem.onClick(). this.data=" + JSON.stringify(this.data));
          this.dialog.open(EditButtonItemDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe( theData => {
               if (theData) {
                  //this.data.IRSignalId = theData.IRSignalId;
                  //console.log("ButtonItem.onClick().afterClosed(): theData=" + JSON.stringify(theData) + "this.data=" + JSON.stringify(this.data));
                  this.messageService.receiveFromChildren(JSON.stringify(theData));
               }
               this.reload();
          });
        } else if (this.selectedSignal) { // treat as request to send IR Signal
           console.log("ButtonItem.onClick(): 1event=" + event + "event.target=" + event.target + "this.selectedSignal=" + this.selectedSignal);
           //REMINDER: the line below causes the IRSignal$ observer to fire
           // whenever it changes which causes the message to be sent at
           // the wrong times. 
           //this.IRSignal$.subscribe(
           //    IRSignal => {
           //      const tmpData: string = `{ "signal": "${IRSignal.signal}" }`;
           //      this.messageService.sendIRSignal(tmpData);
           //    }
           //);
           const tmpData: string = `{ "signal": "${this.selectedSignal}" }`;
           this.messageService.sendIRSignal(tmpData);
        }
    }

    //editItem(event: Event, data: any) {
    //   //console.log("ButtonItem.editItem()");
    //      event.stopPropagation();
    //      console.log("ButtonItem.editItem(): event=" + event + "event.target=" + event.target + "event.srcElement" + event.srcElement);
    //      const dialogConfig = defaultDialogConfig();

    //      dialogConfig.data = {
    //        dialogTitle:"Edit Button",
    //        data,
    //        mode: 'update'
    //      };

    //      this.dialog.open(EditButtonItemDialogComponent, dialogConfig)
    //        .afterClosed()
    //        .subscribe( theData => {
    //           console.log("ButtonItem.editItem().afterClosed(): theData=" + JSON.stringify(theData));
    //           if (theData) {
    //              this.messageService.receiveFromChildren(JSON.stringify(theData));
    //           }
    //        });
    //}

     //onMousedown(event: Event) {
     //  console.log("ButtonItem.onMousedown(): event=" + event + "event.target=" + event.target);
     //   event.stopPropagation();
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
    //@HostListener('touchend', ['$event'])
    //@HostListener('touchcancel', ['$event'])
    handleTouch(event: TouchEvent) {
        console.log("ButtonItem.handleTouch(): event=" + event + " event.type=" + event.type + " event.target=" + event.target);
        let touch = event.touches[0] || event.changedTouches[0];

        // check the events
        if (event.type === 'touchstart') {
            event.preventDefault();
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

