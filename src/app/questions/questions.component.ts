import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AnkiService } from '../anki.service';
import { Question, Resp } from '../question';
import { QuestionDlgComponent } from '../entities/question-dlg/question-dlg.component';


@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  displayedColumns: string[] = ['id', 'question'];
  dataSource : Question[] = [];

  currentCategory: number = 72;
  
  constructor(
    private ankiService: AnkiService,
    private dialog: MatDialog) {}
  ngOnInit(): void {
    this.getQuestion()
  }
  getQuestion(): void {
    this.ankiService.getQuestions(this.currentCategory).subscribe(question => {
      this.dataSource = question;
    });
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

}
