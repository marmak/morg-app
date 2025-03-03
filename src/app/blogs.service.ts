import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpEventType} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { BlogResult } from './blog';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'lol2', 'testi': '0', 'Access-Control-Allow-Origin': "*"})
  };

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<BlogResult> {
    return this.http.get<BlogResult>('/blogs/api/index', this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  searchBlogs(query: string): Observable<any[]> {
    return this.http.get<any[]>('/blogs/api/search?q=' + query, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getBlog(id: number): Observable<BlogInfo> {
    return this.http.get<BlogInfo>('/blogs/api/blog/' + id, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  kagiSummarize(url: string): Observable<any> {
    return this.http.get<any>('/blogs/api/kagiSummarize?url=' + url, {
      headers: this.httpOptions.headers,
      responseType: 'text' as 'json',
      observe: 'events', reportProgress: true}).pipe(
        map(event => {
          if (event.type === HttpEventType.Response) {
            return event.body;
          }
          return '';
        }),
        // scan((acc : string, curr :string) => {
        //   // console.log("curr", curr);
        //   // return acc + curr
        //   return curr;
        // }, ''),
        catchError(error => {
          console.error('Error:', error);
          return EMPTY;
        })
      );
  }
  kagiSummarizeold(url: string): Observable<any> {
    return this.http.get<any>('/blogs/api/kagiSummarize?url=' + url, {
      headers: this.httpOptions.headers,
      responseType: 'text' as 'json',
      observe: 'events', reportProgress: true}).pipe(
        map(event => {
          if (event.type === HttpEventType.Response) {
            return event.body;
          }
          return '';
        }),
        // scan((acc : string, curr :string) => {
        //   // console.log("curr", curr);
        //   // return acc + curr
        //   return curr;
        // }, ''),
        catchError(error => {
          console.error('Error:', error);
          return EMPTY;
        })
      );
  }


  updateStatus(bid: number, status: number): Observable<any> {
    return this.http.post<any>('/blogs/api/updateStatus', {bid: bid, status: status}, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  markRead(updates: any[]): Observable<any> {
    return this.http.post<any>('/blogs/api/markRead', updates, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
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
