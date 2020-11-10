import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';
import {RemoteDash} from '../model/remote-dash';

import { GridsterConfig, GridsterItem } from 'angular-gridster2'; 
import { RemoteDashLayoutService } from '../services/remote-dash-layout.service';

import { RIComponent } from '../components/ri.component';
import { RIItem } from '../components/ri-item';
import { GenericItemComponent } from '../components/generic-item.component';
import { ButtonItemComponent } from '../components/button-item.component';

@Component({
    selector: 'remote-dash',
    templateUrl: './remote-dash.component.html',
    styleUrls: ['./remote-dash.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDashComponent implements OnInit {

    RemoteDash$: Observable<RemoteDash>;

    loading$: Observable<boolean>;

    constructor(
        private route: ActivatedRoute,
        public layoutService: RemoteDashLayoutService,
        private remoteDashesService: RemoteDashEntityService) {
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
     set components(gridsterComponents: RIComponent[]) {
       this.layoutService.components = gridsterComponents;
     }
     set componentsObjs(gridsterComponentsObjs: RIItem[]) {
       this.layoutService.componentsObjs = gridsterComponentsObjs;
     }

    ngOnInit() {
 
        const RemoteDashUrl = this.route.snapshot.paramMap.get('RemoteDashUrl');

        this.RemoteDash$ = this.remoteDashesService.entities$
            .pipe(
                map(RemoteDashes => RemoteDashes.find(RemoteDash => RemoteDash.id == parseInt(RemoteDashUrl)))
            );
        this.RemoteDash$.subscribe(
            RemoteDash => {
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

}
