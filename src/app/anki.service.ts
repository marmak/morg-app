import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Question, Resp } from './question';

@Injectable({
  providedIn: 'root'
})
export class AnkiService {

  private ankiUrl = '/api/random_question/72?web=true';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'lol2', 'testi': '0', 'Access-Control-Allow-Origin': "*"})
  };

  
  constructor(private http: HttpClient) { }

  getAnki(): Observable<Question> {
    let k = this.http.get<Question[]>(this.ankiUrl, this.httpOptions)
      .pipe(
        map(questions => questions[0]),
        tap(q => console.log("fetched question {}", q)),
        catchError(this.handleError))
    return k;
  }

  answer(qid: number, answer: number): Observable<Resp> {
    let r = this.http.get<Resp>(`/api/answer2/${qid}/${answer}`, this.httpOptions)
    return r;
  }

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
