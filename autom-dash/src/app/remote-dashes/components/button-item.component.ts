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
    <div class="app-button-item" >
      <div class="app-button-item-irsignal" (mousedown)="onMouseDown($event)" (mouseup)="onSglClick($event)" (dblclick)="onDblClick($event)" *ngIf="(IRSignal$ | async) as IRSignal; else elseBlock">
         <div class="spinner-container" *ngIf="(loading$ | async )">
           <mat-spinner></mat-spinner>
         </div>
         <br/>
         <h4>{{IRSignal?.name}}</h4>
      </div>
      <ng-template #elseBlock>
         <div class="app-button-item-empty" (mousedown)="onMouseDown($event)" (mouseup)="onSglClick($event)" (dblclick)="onDblClick($event)" >
            <p>Quick click/touch to send IR signal. Long click/touch or swipe down to edit. Double click or swipe left/right to delete.</p>
         </div>
      </ng-template>
    </div>
  `,
    //changeDetection: ChangeDetectionStrategy.OnPush
}
    )
export class ButtonItemComponent implements OnInit, OnChanges, OnDestroy, RIComponent {
    @Input() data: any;

    //subscription: Subscription;

    IRSignalsService: EntityCollectionService<IRSignal>; 
    entityActionFactory: EntityActionFactory; 
    IRSignal$: Observable<IRSignal>;
    loading$: Observable<boolean>;

    selectedSignal: string;

    defaultTouch = { x: 0, y: 0, time: 0 };
    defaultClick = { time: 0 };

    clickTimer: any;

    public event: MouseEvent;
    public clientX = 0;
    public clientY = 0;

    shortPressDuration: number = 200;
    mediumPressDuration: number = 500;
    // reminder: duration >= mediumPressDuration is considered a long press

    constructor(
      private ref: ChangeDetectorRef,
      private store: Store<AppState>,
      private dialog: MatDialog,
      private messageService: RemoteDashItemMessageService,
      EntityCollectionServiceFactory: EntityCollectionServiceFactory) {
         //this.subscription = messageService.toChildren$.subscribe(
         //  message => {
         //    console.log("ButtonItem.messageService.toChildren$()");
         //    this.ref.markForCheck();
         //    this.ref.detectChanges();
         //});      
      this.entityActionFactory = new EntityActionFactory();
      this.IRSignalsService = EntityCollectionServiceFactory.create<IRSignal>('IRSignal');
    }
 
    ngOnInit() {
        //console.log("ButtonItem.ngOnInit(): here1 this.data=" + JSON.stringify(this.data));
        this.reload();
    }
  
    ngOnChanges(changes: SimpleChanges) {
       //console.log("ButtonItem.ngOnChanges(): changes=" + JSON.stringify(changes));
       this.reload();
    }

    reload() {

        this.loading$ = this.IRSignalsService.loading$.pipe(delay(0));
        this.IRSignal$ = this.IRSignalsService.entities$
            .pipe(
                map(IRSignals => IRSignals.find(IRSignal => IRSignal.id == parseInt(this.data.IRSignalId))),
        );

        if (this.data.IRSignalId) {
           //console.log("ButtonItem.reload(): here1 this.data=" + JSON.stringify(this.data));
           this.IRSignal$.subscribe(
              IRSignal => {
                 //console.log("ButtonItem.reload(): IRSignal=" + JSON.stringify(IRSignal));
                 this.selectedSignal = IRSignal.signal;
              }
           );
        }
    }

    ngOnDestroy() {
      // prevent memory leak when component destroyed
      console.log("ButtonItem.ngOnDestroy()");
      //this.subscription.unsubscribe();
    }


    handleEdit() {
       const dialogConfig = defaultDialogConfig();

       dialogConfig.data = {
         dialogTitle:"Edit Button",
         data: this.data,
         mode: 'update'
       };
       //console.log("ButtonItem.handleEdit(). this.data=" + JSON.stringify(this.data));
       this.dialog.open(EditButtonItemDialogComponent, dialogConfig)
         .afterClosed()
         .subscribe( theData => {
            if (theData) {
               //this.data.IRSignalId = theData.IRSignalId;
               //console.log("ButtonItem.handleEdit().afterClosed(): theData=" + JSON.stringify(theData) + "this.data=" + JSON.stringify(this.data));
               this.messageService.receiveFromChildren(JSON.stringify(theData));
            }
            this.reload();
       });
    }

    handleDelete() {
       const tmpData: string = `{ "id": "${this.data.id}" }`;
       this.messageService.deleteReceiveFromChildren(tmpData);
    }

    handleSendIR() {
       const tmpData: string = `{ "signal": "${this.selectedSignal}" }`;
       this.messageService.sendIRSignal(tmpData);
    }

    onMouseDown(event: Event) {
       event.stopPropagation();
       event.preventDefault();
       console.log("ButtonItem.onMouseDown()");
       this.defaultClick.time = event.timeStamp;
    }

    //@HostListener('click', ['$event'])
    //onClick(event: any) {
    onClick1(event: Event) {
       event.stopPropagation();
       event.preventDefault();
       
       let deltaTime = event.timeStamp - this.defaultClick.time;
       console.log("ButtonItem.onClick(): event=" + event + "event.target=" + event.target + " deltaTime=", deltaTime);
       //console.log("ButtonItem.onClick(): this.data=" + JSON.stringify(this.data));
       let tmpString: string = event.target.toString();
       if (tmpString.includes("HTMLButtonElement")) {
          this.handleEdit();
       } else if (this.selectedSignal) { // treat as request to send IR Signal
          console.log("ButtonItem.onClick(): event=" + event + "event.target=" + event.target + "this.selectedSignal=" + this.selectedSignal);
          //REMINDER: the line below causes the IRSignal$ observer to fire
          // whenever it changes which causes the message to be sent at
          // the wrong times. 
          //this.IRSignal$.subscribe(
          //    IRSignal => {
          //      const tmpData: string = `{ "signal": "${IRSignal.signal}" }`;
          //      this.messageService.sendIRSignal(tmpData);
          //    }
          //);
          this.handleSendIR();
       }
    }

    onSglClick(event: Event): void {
       console.log("ButtonItem.onSglClick(): event=" + event + "event.target=" + event.target);
       if (! this.clickTimer) {
          this.clickTimer = setTimeout( () => { this.onClick(event);}, 300); 
       }
    }

    //@HostListener('click', ['$event'])
    //onClick(event: any) {
    onClick(event: Event) {
       event.stopPropagation();
       event.preventDefault();
       this.clickTimer = undefined;

       let deltaTime = event.timeStamp - this.defaultClick.time;
       console.log("ButtonItem.onClick(): event=" + event + "event.target=" + event.target + " deltaTime=", deltaTime);
       //console.log("ButtonItem.onClick(): this.data=" + JSON.stringify(this.data));
       if ((deltaTime < this.shortPressDuration) &&
           (this.selectedSignal)) {
          this.handleSendIR();
       } else if (deltaTime < this.mediumPressDuration) { //  treat as what?
          console.log("ButtonItem.onClick(): medium press");
       } else { // treat as long press
          this.handleEdit();
       }
    }

    onDblClick(event: Event) {
       clearTimeout(this.clickTimer);
       this.clickTimer = undefined;
       console.log("ButtonItem.onDblClick(): event=" + event + "event.target=" + event.target);
       event.stopPropagation();
       event.preventDefault();

       this.handleDelete();
    }

    onEvent(event: MouseEvent): void {
        console.log("ButtonItem.onEvent()");
        this.event = event;
    }

    coordinates(event: MouseEvent): void {
        console.log("ButtonItem.coordinates()");
        this.clientX = event.clientX;
        this.clientY = event.clientY;
    }

    @HostListener('touchstart', ['$event'])
    //@HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event: TouchEvent) {
        console.log("ButtonItem.handleTouch(): event=" + event + " event.type=" + event.type + " event.target=" + event.target);
        //console.log("ButtonItem.handleTouch(): this.data=" + JSON.stringify(this.data));
        let touch = event.touches[0] || event.changedTouches[0];

        // check the events
        if (event.type === 'touchstart') {
            event.preventDefault();
            event.stopPropagation();
            this.defaultTouch.x = touch.pageX;
            this.defaultTouch.y = touch.pageY;
            this.defaultTouch.time = event.timeStamp;
        } else if (event.type === 'touchend') {
            let deltaX = touch.pageX - this.defaultTouch.x;
            let deltaY = touch.pageY - this.defaultTouch.y;
            let deltaTime = event.timeStamp - this.defaultTouch.time;

            console.log("ButtonItem.handleTouch(): event.type=" + event.type + " deltaTime=", deltaTime);
            // simulate a "short touch" with no swipe
            if ((deltaTime < this.shortPressDuration) &&
                (Math.abs(deltaX) <= 60) &&
                (Math.abs(deltaY) <= 60)) {
                this.handleSendIR();
            } else if (deltaTime < this.mediumPressDuration) {
               // simulte a swipe -> less than 500 ms and more than 60 px
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
                  
            } else {
               // simulate a "long touch"
               this.handleEdit();
            }
        }
    }

    doSwipeLeft(event) {
        console.log('swipe left', event);
        this.handleDelete();
    }

    doSwipeRight(event) {
        console.log('swipe right', event);
        this.handleDelete();
    }

    doSwipeUp(event) {
        console.log('swipe up', event);
    }

    doSwipeDown(event) {
        console.log('swipe down', event);
        this.handleEdit();
    }
}

