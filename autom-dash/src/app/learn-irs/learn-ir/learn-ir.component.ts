import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LearnIR} from '../model/learn-ir';
import {Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {LearnIRsHttpService} from '../services/learn-irs-http.service';
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

    lessons$: Observable<Lesson[]>;

    displayedColumns = ['seqNo', 'description', 'duration'];

    nextPage = 0;

    constructor(
        private learnIRsService: LearnIREntityService,
        private lessonsService: LessonEntityService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {

        const learnIRUrl = this.route.snapshot.paramMap.get('learnIRUrl');

        this.learnIR$ = this.learnIRsService.entities$
            .pipe(
                map(learnIRs => learnRs.find(learnIR => learnIR.url == learnIRUrl))
            );

        this.lessons$ = this.lessonsService.entities$
            .pipe(
                withLatestFrom(this.learnIR$),
                tap(([lessons, learnIR]) => {
                    if (this.nextPage == 0) {
                        this.loadLessonsPage(learnIR);
                    }
                }),
                map(([lessons, learnIR]) =>
                    lessons.filter(lesson => lesson.learnIRId == learnIR.id))
            );

        this.loading$ = this.lessonsService.loading$.pipe(delay(0));

    }

    loadLessonsPage(learnIR: LearnIR) {
        this.lessonsService.getWithQuery({
            'learnIRId': learnIR.id.toString(),
            'pageNumber': this.nextPage.toString(),
            'pageSize': '3'
        });

        this.nextPage += 1;

    }

}
