
import {shareReplay, filter, tap, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, BehaviorSubject} from "rxjs";
import {User} from "../model/user";
import {Store} from "@ngrx/store";
import {AppState} from '../../reducers';

import {logout} from '../auth.actions';

export const ANONYMOUS_USER: User = {
    id: undefined,
    email: undefined,
    roles: []
}


@Injectable()
export class AuthService {

    private subject = new BehaviorSubject<User>(undefined);

    user$: Observable<User> = this.subject.asObservable().pipe(filter(user => !!user));

    isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.id));

    isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));

    constructor(private http: HttpClient,
                private store: Store<AppState>) {
        http.get<User>('/api/user').pipe(
            tap(console.log))
            .subscribe(user => this.subject.next(user ? user : ANONYMOUS_USER));
    }

    signUp(email:string, password:string ) {

        return this.http.post<User>('/api/signup', {email, password}).pipe(
            shareReplay(),
            tap(user => this.subject.next(user)),);
    }

    login(email:string, password:string ) {
        return this.http.post<User>('/api/login', {email, password}).pipe(
            shareReplay(),
            tap(user => this.subject.next(user)),);
    }

    loginAsUser(email:string) {
        return this.http.post<User>('/api/admin', {email}).pipe(
            shareReplay(),
            tap(user => this.subject.next(user)),);
    }

    logout() : Observable<any> {
        console.log("AuthService: logout()");
        //this.store.dispatch(logout());
        //localStorage.removeItem('entityCache');

        return this.http.post('/api/logout', null).pipe(
            shareReplay(),
            tap(user => this.subject.next(ANONYMOUS_USER)),);
    }
}








