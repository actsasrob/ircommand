

import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {RemoteDash} from "../model/remote-dash";
import {map} from "rxjs/operators";
import {Lesson} from "../model/lesson";


@Injectable()
export class RemoteDashesHttpService {

    constructor(private http:HttpClient) {

    }

    findAllRemoteDashes(): Observable<RemoteDash[]> {
        return this.http.get('/api/remoteDashes')
            .pipe(
                map(res => res['payload'])
            );
    }

    findRemoteDashByUrl(remoteDashUrl: string): Observable<RemoteDash> {
      return this.http.get<RemoteDash>(`/api/remoteDashes/${remoteDashUrl}`);
    }

    findLessons(
        remoteDashId:number,
        pageNumber = 0, pageSize = 3):  Observable<Lesson[]> {

        return this.http.get<Lesson[]>('/api/lessons', {
            params: new HttpParams()
                .set('remoteDashId', remoteDashId.toString())
                .set('sortOrder', 'asc')
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        });
    }


    saveRemoteDash(remoteDashId: string | number, changes: Partial<RemoteDash>) {
        return this.http.put('/api/remoteDash/' + remoteDashId, changes);
    }


}
