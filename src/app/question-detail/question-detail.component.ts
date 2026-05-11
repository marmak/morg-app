import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FsrsCard, Question } from '../question';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const STATE_LABELS: Record<number, string> = {
  0: 'New',
  1: 'Learning',
  2: 'Review',
  3: 'Relearning',
};

const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;

@Component({
    selector: 'app-question-detail',
    imports: [MatCardModule, MatButtonModule, DecimalPipe, DatePipe],
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

  stateLabel(state: number | undefined): string {
    if (state === undefined) return '-';
    return STATE_LABELS[state] ?? String(state);
  }

  retrievability(card: FsrsCard | undefined): number | null {
    if (!card || !card.last_review || !card.stability) return null;
    const last = new Date(card.last_review).getTime();
    if (!Number.isFinite(last)) return null;
    const tDays = (Date.now() - last) / (1000 * 60 * 60 * 24);
    return Math.pow(1 + FSRS_FACTOR * tDays / card.stability, FSRS_DECAY);
  }

  nextOptionKeys(): string[] {
    return ['1', '2', '3', '4'];
  }

  nextOptionLabel(key: string): string {
    return { '1': 'Forgot', '2': 'Wrong', '3': 'Hard', '4': 'OK' }[key] ?? key;
  }
}
