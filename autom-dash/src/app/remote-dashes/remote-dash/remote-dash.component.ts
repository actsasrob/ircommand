import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';
import {RemoteDash} from '../model/remote-dash';

import { GridsterConfig, GridsterItem } from 'angular-gridster2'; 
import { RemoteDashLayoutService, IComponent } from '../services/remote-dash-layout.service';

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
     get components(): IComponent[] {
       return this.layoutService.components;
     }

     set layout(gridsterItems: GridsterItem[]) {
       this.layoutService.layout = gridsterItems;
     }  
     set components(gridsterComponents: IComponent[]) {
       this.layoutService.components = gridsterComponents;
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
