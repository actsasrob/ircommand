import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {LearnIR} from '../model/learn-ir';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';



@Injectable()
export class LearnIRsDataService extends DefaultDataService<LearnIR> {


    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('LearnIR', http, httpUrlGenerator);

    }

    getAll(): Observable<LearnIR[]> {
        return this.http.get('/api/learnIRs')
            .pipe(
                map(res => res["payload"])
            );
    }

}
