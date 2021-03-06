import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {IRSignal} from '../../ir-signals/model/ir-signal';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap,map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';

@Injectable()
export class IRSignalsDataService extends DefaultDataService<IRSignal> {

    env=environment

    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('IRSignal', http, httpUrlGenerator);

    }

    getAll(): Observable<IRSignal[]> {
        //return this.http.get(`${environment.apiUrl}/api/IRSignals`)
        return this.http.get('/api/IRSignals')
          .pipe(
             map(res => res["payload"]),
             //map(IRSignals => IRSignals.filter(IRSignal => IRSignal.user.id == JSON.parse(localStorage.getItem('user')).id)),
      );
    }

}
