import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IRSignal} from '../model/ir-signal';
import {Observable, of} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
//import {IRSignalsHttpService} from '../services/ir-signals-http.service';
import {IRSignalEntityService} from '../services/ir-signal-entity.service';


@Component({
    selector: 'ir-signal',
    templateUrl: './ir-signal.component.html',
    styleUrls: ['./ir-signal.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IRSignalComponent implements OnInit {

    IRSignal$: Observable<IRSignal>;

    loading$: Observable<boolean>;

    displayedColumns = ['name', 'iconUrl', 'seqNo', 'signal',];

    nextPage = 0;

    constructor(
        private IRSignalsService: IRSignalEntityService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {

        const IRSignalUrl = this.route.snapshot.paramMap.get('IRSignalUrl');

        const user = JSON.parse(localStorage.getItem('user')); 

        this.IRSignal$ = this.IRSignalsService.entities$
            .pipe(
                map(IRSignals => IRSignals.find(IRSignal => IRSignal.userId == user.id))
            );

}


}
