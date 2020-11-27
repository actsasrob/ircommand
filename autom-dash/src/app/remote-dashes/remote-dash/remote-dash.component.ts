import {AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';
import {RemoteDash} from '../model/remote-dash';

import { GridsterConfig, GridsterItem } from 'angular-gridster2'; 
import { RemoteDashLayoutService } from '../services/remote-dash-layout.service';
import {RemoteDashItemMessageService} from '../services/remote-dash-item-message.service';

import { RIComponent } from '../components/ri.component';
import { RIItem } from '../components/ri-item';
import { GenericItemComponent } from '../components/generic-item.component';
import { ButtonItemComponent } from '../components/button-item.component';

import {select, Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import { EntityCollectionServiceFactory,EntityCollectionService, EntityServices, EntityAction, EntityActionFactory, EntityOp } from '@ngrx/data';
import {LearnIR} from '../../learn-irs/model/learn-ir';
import {LearnIREntityService} from '../../shared/services/learn-ir-entity.service';
import { IRService } from '../../shared/services/ir.service';
import {  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { SidenavService } from '../../shared/services/sidenav.service';

@Component({
    selector: 'remote-dash',
    templateUrl: './remote-dash.component.html',
    styleUrls: ['./remote-dash.component.scss'],
    providers: [RemoteDashItemMessageService],
    //Gridster item components don't refresh on change with OnPush
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDashComponent implements OnInit,OnDestroy {

    RemoteDash$: Observable<RemoteDash>;

    loading$: Observable<boolean>;

    learnIRsService: EntityCollectionService<LearnIR>; 
    entityActionFactory: EntityActionFactory; 
    learnIRs$: Observable<LearnIR[]>;

    LearnIR$: Observable<LearnIR>;

    IRSignalIOMessage: string = "";
   
    destroy$: Subject<boolean> = new Subject<boolean>();

    selectedLearnIRAddress: string = "";

    constructor(
        private sidenavService: SidenavService,
        private ref: ChangeDetectorRef,
        private appRef: ApplicationRef, 
        private store: Store<AppState>,
        private route: ActivatedRoute,
        public layoutService: RemoteDashLayoutService,
        private remoteDashesService: RemoteDashEntityService,
        EntityCollectionServiceFactory: EntityCollectionServiceFactory,
        private irService: IRService,
        private messageService: RemoteDashItemMessageService) {
            this.entityActionFactory = new EntityActionFactory();

            this.learnIRsService = EntityCollectionServiceFactory.create<LearnIR>('LearnIR');
    } 

    get options(): GridsterConfig {
       return this.layoutService.options;
     }  
     get layout(): GridsterItem[] {
       return this.layoutService.layout;
     }  
     get components(): RIComponent[] {
       return this.layoutService.components;
     }
     get componentsObjs(): RIItem[] {
       return this.layoutService.componentsObjs;
     }

     set layout(gridsterItems: GridsterItem[]) {
       this.layoutService.layout = gridsterItems;
     }  

     // the component data as JSON
     set components(gridsterComponents: RIComponent[]) {
       this.layoutService.components = gridsterComponents;
     }
     // the components as objects
     set componentsObjs(gridsterComponentsObjs: RIItem[]) {
       this.layoutService.componentsObjs = gridsterComponentsObjs;
     }

    ngOnInit() {
 
        const RemoteDashUrl = this.route.snapshot.paramMap.get('RemoteDashUrl');

        this.RemoteDash$ = this.remoteDashesService.entities$
            .pipe(
                map(RemoteDashes => RemoteDashes.find(RemoteDash => RemoteDash.id == parseInt(RemoteDashUrl)))
            );
        var learnIRId: number;
        this.RemoteDash$.subscribe(
            RemoteDash => {
                learnIRId = RemoteDash.learnIRId;
                this.layout = JSON.parse(RemoteDash.layout);
                this.components = JSON.parse(RemoteDash.components);
                this.componentsObjs = [];
                var tmpComponent: RIItem;
                //console.log("RemoteDashComponent.ngOnInit(): here1");  
                this.components.find(c => {
                   const comp: any = c;
                   //console.log("RemoteDashComponent.ngOnInit(): before switch: " + JSON.stringify(comp));  
                   switch(comp.component) { 
                      case "ButtonItemComponent": { 
                         //console.log("RemoteDashComponent.ngOnInit(): in ButtonItemComponent case");  
                         tmpComponent = new RIItem(ButtonItemComponent, c.data);
                         this.componentsObjs.push(tmpComponent);
                         break; 
                      } 
                      case "GenericItemComponent": { 
                         tmpComponent = new RIItem(GenericItemComponent, c.data);
                         this.componentsObjs.push(tmpComponent);
                         break; 
                      } 
                   }
                });
            }    
        );

        this.learnIRs$ = this.learnIRsService.entities$
        this.learnIRs$.subscribe(result => { console.log("EditIRSignalDialogComponent.ngOnInit(): here here here: " + JSON.stringify(result.length)) });
        
        const action = this.entityActionFactory.create<LearnIR>(
           'LearnIR',
           EntityOp.QUERY_ALL
        );

        this.store.dispatch(action);

        this.loading$ = this.learnIRsService.loading$.pipe(delay(0));
        this.LearnIR$ = this.learnIRsService.entities$
            .pipe(
                map(LearnIRs=> LearnIRs.find(LearnIR => LearnIR.id == learnIRId))
        );
        this.LearnIR$.subscribe(
           LearnIR => {
              this.selectedLearnIRAddress = LearnIR.address;
              console.log("RemoteDash.ngOnINit(): this.selectedLearnIRAddress=" + this.selectedLearnIRAddress);
           }
        );

        // grandchild components communicate data changes back to ancestor
        // RemoteDash component via this service subscription
        this.messageService.fromChildren$.subscribe(
          message => {
            console.log(`RemoteDash.messageService.fromChildren$() message=${message}`);
            if (message) {
               //const myData: any = JSON.parse(message); 
               this.layoutService.updateComponent(message);
            }
          }
        );

        // grandchild components communicate request to send IR signals to
        // ancestor RemoteDash component via this service subscription
        this.messageService.IRSignalFromChildren$.subscribe(
          message => {
            console.log(`RemoteDash.messageService.sendIRSignal$() message=${message}`);
            if (message) {
               const myData: any = JSON.parse(message); 
               this.sendIRSignal(myData.signal);
            }
          }
        );
    }
    
    ngOnDestroy() {
    }

   sendIRSignal(signal: string) {
      console.log(`RemoteDash.sendIRSignal: signal=${signal} address=${this.selectedLearnIRAddress}`);
      //this.RemoteDash$.subscribe(
      //   RemoteDash => {
      //      console.log("RemoteDash.sendIRSignal(): RemoteDash=" + JSON.stringify(RemoteDash));
      //   }
      //);
      this.irService.sendPostRequest(this.selectedLearnIRAddress, signal)
         .pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
           console.log(res);
           this.IRSignalIOMessage = res.body;
       })  
    }

    // dropId is the UUID of the target layout item for the drop 
    setDropId(dropId: string): void {
      console.log("RemoteDashLayoutService.setDropId(): dropId=" + dropId);
      this.layoutService.dropId = dropId;
    }
    
    // dragId is the type of the component dropped 
    dropItem(dragId: string): void {  
       this.layoutService.dropItem(dragId);
       console.log("RemoteDash.dropItem(): before sendToChildren");  
       this.messageService.sendToChildren("refresh");
       this.ref.detectChanges();
       this.ref.markForCheck();
    }

    onSave() {
      let myPartial:Partial<RemoteDash>;
      this.RemoteDash$.subscribe(
         RemoteDash => {
            console.log("RemoteDashComponent.onSave(): " + JSON.stringify(RemoteDash))
            let gridsterCfg = { layout: JSON.stringify(this.layout), components: JSON.stringify(this.components) };
            myPartial = { ...RemoteDash, ...gridsterCfg};
            console.log("RemoteDashComponent.onSave(): myPartial=" + JSON.stringify(myPartial))
         }
      );
      this.remoteDashesService.update(myPartial);

    }

  toggleSidenav() {
     this.sidenavService.toggle();
  }
}
