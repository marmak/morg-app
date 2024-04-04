import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AnkiService } from '../anki.service';
import { Question, Category } from '../question';
import { QuestionDlgComponent } from '../entities/question-dlg/question-dlg.component';
import { Observable, of, throwError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { PageEvent, MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [MatTableModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, MatOptionModule, CommonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'question'];
  dataSource : Question[] = [];
  dataView: Question[] = [];
  categories: Category[] = [];
  currentCategory: number = 72;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions?: Observable<string[]>;
  pageSizeOptions = [5, 10, 25, 100];
  pageSize = 25;
  page = 0
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild('sortQuestions', {static: true}) sortQuestions?: MatSort;

  constructor(
    private ankiService: AnkiService,
    private dialog: MatDialog) {

    }

  ngAfterViewInit() {
    this.paginator?.page.subscribe((event: PageEvent) => {
      this.pageSize = event.pageSize;
      this.page = event.pageIndex;
      this.dataView = this.dataSource.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    });
    this.sortQuestions?.sortChange.subscribe((sort: Sort) => {
      let direction = sort.direction === 'asc' ? 1 : -1;
      this.dataView = this.dataSource.sort((a, b) => {
        if (a.id < b.id) {
          return -1 * direction;
        }
        if (a.id > b.id) {
          return 1 * direction;
        }
        return 0;
      });
      this.dataView = this.dataView.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    }
    );
  }

  ngOnInit(): void {
    this.getQuestion()
    this.getCategories()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    )

    this.myControl.valueChanges.subscribe(value => {
      console.log(value); // Or your custom change handling logic here
      this.handleChange(value); // Calling a method to handle the change
    });
    console.log("paginator", this.paginator);
  }

  getCategories(): void {
    this.ankiService.getCategories().subscribe(categories => {
      console.log("categories", categories);
      this.categories = categories;
    });
  }
  getQuestion(): void {
    this.ankiService.getQuestions(this.currentCategory).subscribe(question => {
      this.dataSource = question;
      this.dataView = this.dataSource.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.map(s=>s.name).filter(option => option.toLowerCase().includes(filterValue));
  }
  selectQuestion(q: Question): void {
    console.log("selected question", q);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      question: q
    };
    const dialogRef = this.dialog.open(QuestionDlgComponent, dialogConfig);
  }

  handleChange(value: string): void {
    console.log('Changed value:', value);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value;
    let cid = this.categories.find(c => c.name === selectedValue)?.id;
    console.log('Option selected:', selectedValue, cid);

    if (cid) {
      this.currentCategory = cid;
      this.getQuestion();
    }
  }
}
