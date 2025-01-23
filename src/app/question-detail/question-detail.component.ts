import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgFor, NgIf, UpperCasePipe} from '@angular/common';
import { Question } from '../question';
import { AnkiComponent } from '../anki/anki.component';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-question-detail',
    imports: [NgIf, AnkiComponent, MatCardModule, MatButtonModule, NgFor],
    templateUrl: './question-detail.component.html',
    styleUrl: './question-detail.component.css'
})
export class QuestionDetailComponent {

  @Input() question?: Question;
  @Output() skipEvent = new EventEmitter<void>();
  @Output() answerEvent = new EventEmitter<number>();

  show: boolean = false;

  onSkipClick(): void  {
    this.skipEvent.emit();
  }

  onShowClick(): void  {
    this.show = !this.show;
  }

  onAnswerClick(resp: number): void  {
    this.show = false;
    this.answerEvent.emit(resp);
  }

}
