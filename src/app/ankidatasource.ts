import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
// import * as moment from 'moment/moment';
// import {OUTPUT_DATETIME_FORMAT, INPUT_DATETIME_FORMAT} from './shared/date.format';

export abstract class AnkiDataSource implements DataSource<any> {
  protected dataChangeSubject = new BehaviorSubject<any[]>([]);
  protected loadingSubject = new BehaviorSubject<boolean>(false);  
  filteredData: any[] = [];

  public sortSubject: BehaviorSubject<Sort> = new BehaviorSubject<Sort>(this.defaultSort);
  protected filterSubject = new BehaviorSubject({});

  lastFilter = {};
  lastSort = Object.assign({}, this.defaultSort);

  
  constructor(
    protected paginator: MatPaginator,
    protected matSort: MatSort,
    private readonly defaultSort: Sort = {active: '', direction: 'desc'},
    private readonly customFiltering: any = (col: any) => (input: any) => input,
    private readonly customSorting: any = (col: any) => (input: any) => input
  ) {
    this.resetSortSubject();
  }


  get data(): any[] {
    return this.dataChangeSubject.value;
  }

  get filter(): { [column: string]: string } {
    return this.filterSubject.value;
  }

  set filter(filter: { [column: string]: string }) {
    this.filterSubject.next(filter);
  }
  
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    const dataMutations = [
      this.paginator.page,
      this.matSort.sortChange,
    ];
    console.log("connect", dataMutations);

    return merge(...dataMutations).pipe(
      debounceTime(500),
      switchMap(() => {
        return this.dataChangeSubject.pipe(
            map((tableRows: any[]) => {
                const newRows = this.getNewRows(tableRows);
                this.filteredData = newRows.slice();
                this.paginator.length = newRows.length;
                const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
                return newRows.splice(startIndex, this.paginator.pageSize);
            }))}))
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataChangeSubject.complete();
    this.loadingSubject.complete();
    this.filterSubject.complete();
  }

  private onInit(rows: any[]) {
    return this.filterAndSortRows(rows);
  }

  static shouldShowRow(row: any, filters: { [column: string]: string }, customFiltering: any): boolean {
    const matchFilter = [];

    for (const column of Object.keys(filters)) {
      const valueToFilterBy: string = filters[column];
      const valueBeingChecked: any = row[column];
      if (valueToFilterBy === '') {
        matchFilter.push(true);
      } else if (valueToFilterBy === undefined && valueBeingChecked === undefined) {
        matchFilter.push(true);
      } else if (valueBeingChecked === undefined) {
        matchFilter.push(false);
      } else if (valueToFilterBy !== undefined) {
        if (typeof valueBeingChecked === 'number') {
          matchFilter.push(valueToFilterBy === '' || customFiltering(column)(valueBeingChecked).toString() === valueToFilterBy.toString());
        } else {
          // const dataval = customFiltering(column)(TxDataSource.checkIfDateAndTransform(valueBeingChecked))
              // .toString().toLowerCase();
          // const val = valueToFilterBy.toLowerCase();
          // matchFilter.push(dataval.includes(val));
        }
      }
    }

    return matchFilter.every(Boolean);
  }
  

  private getNewRows(rows: any[]): any[] {
    if (this.hasFilterChanged()) {
      return this.onFilterChanged(rows);
    } else if (this.matSort !== undefined && this.lastSortDiffFromCurrentSort()) {
      return this.onSortChanged(this.filteredData.slice());
    } else {
      return this.onInit(rows);
    }
  }

  private hasFilterChanged(): boolean {
    return JSON.stringify(this.filter) !== JSON.stringify(this.lastFilter);
  }

  private lastSortDiffFromCurrentSort(): boolean {
    return this.matSort.active !== this.lastSort.active || this.matSort.direction !== this.lastSort.direction;
  }

  private filterAndSortRows(rows: any[]): any[] {
    const filteredRows = rows.filter((row: any) => AnkiDataSource.shouldShowRow(row, this.filter, this.customFiltering));
    if (this.matSort !== undefined && this.matSort.active !== undefined && this.matSort.direction !== undefined) {
      return this.sortRows(filteredRows);
    } else {
      return filteredRows;
    }
  }
  
  private onFilterChanged(rows: any[]) {
    this.lastFilter = Object.assign({}, this.filter);
    this.paginator.pageIndex = 0;
    return this.filterAndSortRows(rows);
  }
  
  private onSortChanged(rows: any[]) {
    this.lastSort.active = this.matSort.active;
    this.lastSort.direction = this.matSort.direction;
    this.paginator.pageIndex = 0;
    return this.sortRows(rows);
  }

  private resetSortSubject(): void {
    this.matSort.active = this.defaultSort.active;
    this.matSort.direction = this.defaultSort.direction;
    this.sortSubject.next(this.defaultSort);
    this.matSort.sortChange.emit(this.defaultSort);
  }

  sortRows(data: any[]): any[] {
    if (!this.matSort.active || this.matSort.direction === '') {
      return data;
    }
    return data.sort((row1, row2) => {
      const stringValue1: string = row1[this.matSort.active];
      const stringValue2: string = row2[this.matSort.active];
      const value1: any = this.transformValueForSorting(stringValue1);
      const value2: any = this.transformValueForSorting(stringValue2);
      return (value1 < value2 ? -1 : 1) * (this.matSort.direction === 'asc' ? 1 : -1);
    });
  }

  private transformValueForSorting(value: string): any {
    return this.customSorting(this.matSort.active)(typeof value === 'string' ? value.toLowerCase() : value);
  }
  
  
  
}
