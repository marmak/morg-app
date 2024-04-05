import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AnkiService } from '../anki.service';
import { Question, Category } from '../question';
import { QuestionDlgComponent } from '../entities/question-dlg/question-dlg.component';
import { Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { map, startWith, catchError, finalize } from 'rxjs/operators';
import { FormControl  } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { PageEvent, MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { AnkiDataSource } from '../ankidatasource';


export class QuestionsDataSource extends AnkiDataSource {

  constructor(
    override paginator: MatPaginator,
    override matSort: MatSort,
    private ankiService: AnkiService,
) {
    super(paginator, matSort, {active: 'name', direction: 'asc'});
  }

  loadQuestions(cid: number = 72) {
    this.paginator.pageIndex = 0;
    this.loadingSubject.next(true);    
    return this.ankiService.getQuestions(cid).pipe(
      catchError(err => {
        return of([]);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(questions => {
      console.log("!loadQuestions", questions);
      this.dataChangeSubject.next(questions);
    });
  }
}


@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [MatTableModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, MatOptionModule, CommonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'question'];
  categories: Category[] = [];
  currentCategory: number = 72;
  myControl = new FormControl();
  searchControl = new FormControl();
  filteredOptions?: Observable<Category[]>;
  pageSizeOptions = [5, 10, 25, 100];
  pageSize = 25;
  page = 0

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild('sortQuestions', {static: true}) sortQuestions!: MatSort;

  qDataSource! : QuestionsDataSource;
  
  constructor(
    private ankiService: AnkiService,
    private dialog: MatDialog) {
    }

  ngAfterViewInit() {

    this.paginator.pageIndex = 0;
    this.sortQuestions.sortChange.subscribe((sort: Sort) =>
      this.qDataSource.sortSubject.next(sort));
  }

  ngOnInit(): void {
    
    this.qDataSource = new QuestionsDataSource(this.paginator, this.sortQuestions, this.ankiService);
    this.qDataSource.loadQuestions(this.currentCategory);

    this.ankiService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
    );
  }
  _filter(value: string): Category[] {
      const filterValue = value.toLowerCase();
      return this.categories.filter(option => option.name.toLowerCase().includes(filterValue));
    }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value;
    let cid = this.categories.find(c => c.name === selectedValue)?.id;
    if (cid) {
      this.currentCategory = cid;
      this.qDataSource.loadQuestions(cid);
      this.paginator.page.next(new PageEvent());
    }
  }
}
