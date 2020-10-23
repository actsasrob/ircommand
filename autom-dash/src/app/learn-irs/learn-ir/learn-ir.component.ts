import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, OnDestroy} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LearnIR} from '../model/learn-ir';
import {Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';

//import {LearnIRsHttpService} from '../services/learn-irs-http.service';
import {LearnIREntityService} from '../../shared/services/learn-ir-entity.service';
import { IRService } from '../../shared/services/ir.service';
import {  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';


@Component({
    selector: 'learn-ir',
    templateUrl: './learn-ir.component.html',
    styleUrls: ['./learn-ir.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LearnIRComponent implements OnInit, OnDestroy {

    learnIR$: Observable<LearnIR>;

    loading$: Observable<boolean>;
 
    rawIRSignal: string;

    destroy$: Subject<boolean> = new Subject<boolean>();

    displayedColumns = ['seqNo', 'location', 'aaddress'];

    constructor(
        private learnIRsService: LearnIREntityService,
        private route: ActivatedRoute,
        private irService: IRService,
        private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        const learnIRUrl = this.route.snapshot.paramMap.get('learnIRUrl');

        this.learnIR$ = this.learnIRsService.entities$
            .pipe(
                //tap(() => console.log("Course: ngOnInit: got here")),
                map(learnIRs => learnIRs.find(learnIR => learnIR.id == parseInt(learnIRUrl)))
            );

    }

    ngOnDestroy() {
      this.destroy$.next(true);
      // Unsubscribe from the subject
      this.destroy$.unsubscribe();
    }

    captureIRSignal(learnIR: LearnIR) {
       this.irService.sendGetRequest(learnIR.address)
         .pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
           console.log(res);
           let regexp =  /.*<body>(.*)<\/body.*/mg;
           let match = regexp.exec(JSON.stringify(res));

           let response="No IR Signal Detected. Please try again.";
           if(match.length > 0 && match[1] != 'error') {
              response=match[1];
           }
           this.rawIRSignal = response;

           // mark component for change detection
           this.ref.markForCheck(); 
       })  
    }

    sendIRSignal(learnIR: LearnIR) {
       this.irService.sendPostRequest(learnIR.address)
         .pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
           console.log(res);
           this.rawIRSignal = res.body;

           // mark component for change detection
           this.ref.markForCheck(); 
       })  
    }

}
