import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RemoteDash} from '../model/remote-dash';
import {Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {RemoteDashesHttpService} from '../services/remote-dashes-http.service';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';
import {LessonEntityService} from '../services/lesson-entity.service';


@Component({
    selector: 'remote-dash',
    templateUrl: './remote-dash.component.html',
    styleUrls: ['./remote-dash.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDashComponent implements OnInit {

    remoteDash$: Observable<RemoteDash>;

    loading$: Observable<boolean>;

    displayedColumns = ['seqNo', 'layout'];

    nextPage = 0;

    constructor(
        private remoteDashesService: RemoteDashEntityService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {

        const remoteDashUrl = this.route.snapshot.paramMap.get('remoteDashUrl');

        this.remoteDash$ = this.remoteDashesService.entities$
            .pipe(
                map(remoteDashes => remoteDashes.find(remoteDash => remoteDash.url == remoteDashUrl))
            );

        this.lessons$ = this.lessonsService.entities$
            .pipe(
                withLatestFrom(this.remoteDash$),
                tap(([lessons, remoteDash]) => {
                    if (this.nextPage == 0) {
                        this.loadLessonsPage(remoteDash);
                    }
                }),
                map(([lessons, remoteDash]) =>
                    lessons.filter(lesson => lesson.remoteDashId == remoteDash.id))
            );

        this.loading$ = this.lessonsService.loading$.pipe(delay(0));

    }

    loadLessonsPage(remoteDash: RemoteDash) {
        this.lessonsService.getWithQuery({
            'remoteDashId': remoteDash.id.toString(),
            'pageNumber': this.nextPage.toString(),
            'pageSize': '3'
        });

        this.nextPage += 1;

    }

}
