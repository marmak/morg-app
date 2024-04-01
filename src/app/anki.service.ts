import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
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

  
  // getAnki2(): Observable<Question> {

  //   const selectedQuestion: Question = {
  //     id: 2,
  //     question: "aa2sx",
  //     answer: "bbx"
  //   }
  //   const q = of(selectedQuestion)
  //   return q;
  // }

  getAnki(): Observable<Question> {
    let k = this.http.get<Question[]>(this.ankiUrl, this.httpOptions)
      .pipe(
        map(questions => questions[0]),
        tap(q => console.log("fetched question {}", q)))
    return k;
  }

  answer(qid: number, answer: number): Observable<Resp> {
    let r = this.http.get<Resp>(`/api/answer2/${qid}/${answer}`, this.httpOptions)
    return r;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message)
    // this.messageService.add(`HeroService: ${message}`);
  }
}
