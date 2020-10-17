import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LearnIR} from '../model/learn-ir';
import {Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
//import {LearnIRsHttpService} from '../services/learn-irs-http.service';
import {LearnIREntityService} from '../services/learn-ir-entity.service';
import {LessonEntityService} from '../services/lesson-entity.service';


@Component({
    selector: 'learn-ir',
    templateUrl: './learn-ir.component.html',
    styleUrls: ['./learn-ir.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LearnIRComponent implements OnInit {

    learnIR$: Observable<LearnIR>;

    loading$: Observable<boolean>;

    displayedColumns = ['seqNo', 'location', 'aaddress'];

    nextPage = 0;

    constructor(
        private learnIRsService: LearnIREntityService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {

        const learnIRUrl = this.route.snapshot.paramMap.get('learnIRUrl');

        this.learnIR$ = this.learnIRsService.entities$
            .pipe(
                //tap(() => console.log("Course: ngOnInit: got here")),
                map(learnIRs => learnIRs.find(learnIR => learnIR.id == parseInt(learnIRUrl)))
            );

}


}
