import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';

export interface MyData {
  id: number;
  name: string;
}

export class CustomDataSource extends DataSource<MyData> {
  private data: MyData[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
  ];

  connect(): Observable<MyData[]> {
    console.log("connect");
    return of(this.data);
  }

  disconnect(): void {}
}
