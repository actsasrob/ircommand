import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {RemoteDash} from '../model/remote-dash';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap,map} from 'rxjs/operators';



@Injectable()
export class RemoteDashesDataService extends DefaultDataService<RemoteDash> {


    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('RemoteDash', http, httpUrlGenerator);

    }

    getAll(): Observable<RemoteDash[]> {
        return this.http.get('/api/remoteDashes')
          .pipe(
             map(res => res["payload"]),
             tap(RemoteDashes => console.log("RemoteDash.RemoteDashesDataService: before filter: " + JSON.stringify(RemoteDashes))),
             //map(RemoteDashes => RemoteDashes.filter(RemoteDash => RemoteDash.user.id == JSON.parse(localStorage.getItem('user')).id)),
             map(RemoteDashes => {
                const rds = <any[]>RemoteDashes;
                rds.forEach(rd => rd.learnIRId = rd.learnIR.id);
                return rds;
             }),
             tap(RemoteDashes => console.log("RemoteDash.RemoteDashesDataService: after1 filter: " + JSON.stringify(RemoteDashes))),
      );
    }

}
