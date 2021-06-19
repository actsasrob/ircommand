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
    return this.httpClient.get("https://" + url, {  params: new HttpParams({fromString: "_page=1&_limit=20"}), responseType: 'text', observe: "response"}).pipe(retry(0), catchError(this.handleError));
  }

  public sendPostRequest(url, payload){
    return this.httpClient.post("https://" + url, payload,{  params: new HttpParams({fromString: "_page=0&_limit=20"}), responseType: 'text', observe: "response"}).pipe(retry(0), catchError(this.handleError));
  }
}
