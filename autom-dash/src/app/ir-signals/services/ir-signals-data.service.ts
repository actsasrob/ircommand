import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {IRSignal} from '../model/ir-signal';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap,map} from 'rxjs/operators';



@Injectable()
export class IRSignalsDataService extends DefaultDataService<IRSignal> {


    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('IRSignal', http, httpUrlGenerator);

    }

    getAll(): Observable<IRSignal[]> {
        return this.http.get('/api/IRSignals')
          .pipe(
             map(res => res["payload"]),
             tap(IRSignals => console.log("IRSignal.IRSignalsDataService: " + JSON.stringify(IRSignals))),
             map(IRSignals => IRSignals.filter(IRSignal => IRSignal.user.id == JSON.parse(localStorage.getItem('user')).id)),
             tap(IRSignals => console.log("IRSignal.IRSignalsDataService1: " + JSON.stringify(IRSignals))),
      );
    }

}
