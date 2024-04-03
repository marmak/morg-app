import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
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

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [MatTableModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, MatOptionModule, CommonModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  displayedColumns: string[] = ['id', 'question'];
  dataSource : Question[] = [];
  categories: Category[] = [];
  currentCategory: number = 72;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions?: Observable<string[]>;
  
  constructor(
    private ankiService: AnkiService,
    private dialog: MatDialog) {}

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
