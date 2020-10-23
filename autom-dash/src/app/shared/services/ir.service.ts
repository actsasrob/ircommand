import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class IRService {

  //private REST_API_SERVER = "http://localhost:3000/products";

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest(url){
    return this.httpClient.get("http://" + url, {  params: new HttpParams({fromString: "_page=1&_limit=20"}), responseType: 'text', observe: "response"}).pipe(retry(0), catchError(this.handleError));
  }

  public sendPostRequest(url){
    return this.httpClient.post("http://" + url, "28 010A 0318 00F6 074E 00F4 B1F8 00F4 A9B8 01 F0 7F 14 00 20 10 00 F1 4F 04 11 30 1F 07 F1 40 00" ,{  params: new HttpParams({fromString: "_page=1&_limit=20"}), responseType: 'text', observe: "response"}).pipe(retry(0), catchError(this.handleError));
  }
}
