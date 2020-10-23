import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {LearnIR} from '../../learn-irs/model/learn-ir';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap,map} from 'rxjs/operators';



@Injectable()
export class LearnIRsDataService extends DefaultDataService<LearnIR> {


    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('LearnIR', http, httpUrlGenerator);

    }

    getAll(): Observable<LearnIR[]> {
        console.log("LearnIRsDataService.getAll()");
        /*return this.http.get('/api/learnIRs')
            .pipe(
                map(res => res["payload"])
            );
        */
        return this.http.get('/api/learnIRs')
          .pipe(
             map(res => res["payload"]),
             tap(learnIRs => console.log("LearnIR.LearnIRsDataService: " + JSON.stringify(learnIRs))),
             map(learnIRs => learnIRs.filter(learnIR => learnIR.user.id == JSON.parse(localStorage.getItem('user')).id)),
             tap(learnIRs => console.log("LearnIR.LearnIRsDataService1: " + JSON.stringify(learnIRs))),
      );
    }

}
