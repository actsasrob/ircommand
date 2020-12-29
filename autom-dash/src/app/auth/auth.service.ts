import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "./model/user.model";

import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {

    env=environment;

    constructor(private http:HttpClient) {
       console.log("AuthService: env=" + JSON.stringify(this.env));
    }

    login(email:string, password:string): Observable<User> {
        //return this.http.post<User>(`${environment.apiUrl}/api/login`, {email,password});
        return this.http.post<User>('/api/login', {email,password});
    }

}
