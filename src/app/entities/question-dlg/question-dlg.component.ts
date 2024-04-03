import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Question, Resp } from '../../question';
@Component({
  selector: 'app-question-dlg',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './question-dlg.component.html',
  styleUrl: './question-dlg.component.css'
})
export class QuestionDlgComponent {
  question: Question;
  constructor(
    private dialogRef: MatDialogRef<QuestionDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown
  ) {
    this.question = data as Question;
    console.log("QuestionDlgComponent", this.question);
  }
}
