import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgIf, UpperCasePipe} from '@angular/common';
import { Question } from '../question';
import { AnkiComponent } from '../anki/anki.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [NgIf, AnkiComponent],
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.css'
})
export class QuestionDetailComponent {

  @Input() question?: Question;
  @Output() skipEvent = new EventEmitter<void>();
  @Output() answerEvent = new EventEmitter<number>();

  show: boolean = false;
  onSkipClick(): void  {
    console.log("skip!")
    this.skipEvent.emit();
  }

  onShowClick(): void  {
    console.log("show!")
    // toggle show
    this.show = !this.show;
  }

  onAnswerClick(resp: number): void  {
    console.log("answer" + resp)
    this.show = false;
    this.answerEvent.emit(resp);
  }

}
