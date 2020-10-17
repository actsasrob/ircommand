import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RemoteDash} from '../model/remote-dash';
import {Observable, of} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
//import {RemoteDashesHttpService} from '../services/remote-dashes-http.service';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';


@Component({
    selector: 'remote-dash',
    templateUrl: './remote-dash.component.html',
    styleUrls: ['./remote-dash.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDashComponent implements OnInit {

    RemoteDash$: Observable<RemoteDash>;

    loading$: Observable<boolean>;

    displayedColumns = ['name', 'iconUrl', 'seqNo', 'signal',];

    nextPage = 0;

    constructor(
        private RemoteDashesService: RemoteDashEntityService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {

        const RemoteDashUrl = this.route.snapshot.paramMap.get('RemoteDashUrl');


        this.RemoteDash$ = this.RemoteDashesService.entities$
            .pipe(
                map(RemoteDashes => RemoteDashes.find(RemoteDash => RemoteDash.id == parseInt(RemoteDashUrl)))
            );

}


}
