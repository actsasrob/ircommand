import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {RemoteDash} from '../model/remote-dash';
import {Observable, of} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';

import { GridsterConfig, GridsterItem } from 'angular-gridster2'; 
import { LayoutService, IComponent } from '../../shared/services/layout.service';


@Component({
    selector: 'remote-dash',
    templateUrl: './remote-dash.component.html',
    styleUrls: ['./remote-dash.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDashComponent implements OnInit {

    RemoteDash$: Observable<RemoteDash>;

    loading$: Observable<boolean>;


    get options(): GridsterConfig {
       return this.layoutService.options;
     }  
     get layout(): GridsterItem[] {
       return this.layoutService.layout;
     }  
     get components(): IComponent[] {
       return this.layoutService.components;
     }

    constructor(
        private RemoteDashesService: RemoteDashEntityService,
        private route: ActivatedRoute,
        public layoutService: LayoutService) {

    }

    ngOnInit() {

        const RemoteDashUrl = this.route.snapshot.paramMap.get('RemoteDashUrl');


        this.RemoteDash$ = this.RemoteDashesService.entities$
            .pipe(
                map(RemoteDashes => RemoteDashes.find(RemoteDash => RemoteDash.id == parseInt(RemoteDashUrl)))
            );

    }

}
