import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BlogItem, BlogResult } from './blog';

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
