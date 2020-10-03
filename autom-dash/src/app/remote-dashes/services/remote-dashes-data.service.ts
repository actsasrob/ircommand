import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {RemoteDash} from '../model/remote-dash';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';



@Injectable()
export class RemoteDashesDataService extends DefaultDataService<RemoteDash> {


    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('RemoteDash', http, httpUrlGenerator);

    }

    getAll(): Observable<RemoteDash[]> {
        return this.http.get('/api/remoteDashes')
            .pipe(
                map(res => res["payload"])
            );
    }

}
