

import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {LearnIR} from "../model/learn-ir";
import {map} from "rxjs/operators";
import {Lesson} from "../model/lesson";


@Injectable()
export class LearnIRsHttpService {

    constructor(private http:HttpClient) {

    }

    findAllLearnIRs(): Observable<LearnIR[]> {
        return this.http.get('/api/learnIRs')
            .pipe(
                map(res => res['payload'])
            );
    }

    findLearnIRByUrl(learnIRUrl: string): Observable<LearnIR> {
      return this.http.get<LearnIR>(`/api/learnIRs/${learnIRUrl}`);
    }

    findLessons(
        learnIRId:number,
        pageNumber = 0, pageSize = 3):  Observable<Lesson[]> {

        return this.http.get<Lesson[]>('/api/lessons', {
            params: new HttpParams()
                .set('learnIRId', learnIRId.toString())
                .set('sortOrder', 'asc')
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        });
    }


    saveLearnIR(learnIRId: string | number, changes: Partial<LearnIR>) {
        return this.http.put('/api/learnIR/' + learnIRId, changes);
    }


}
