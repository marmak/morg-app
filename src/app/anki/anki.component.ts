import { Component, ElementRef, ViewChild } from '@angular/core';
import {NgIf, UpperCasePipe} from '@angular/common';
import { PendingCounts, Question } from '../question';
import { AnkiService } from '../anki.service';
import { QuestionDetailComponent } from '../question-detail/question-detail.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap, finalize, BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-anki',
  standalone: true,
  imports: [NgIf, QuestionDetailComponent, FormsModule, MatButtonModule, MatDividerModule, RouterModule],
  templateUrl: './anki.component.html',
  styleUrl: './anki.component.css'
})
export class AnkiComponent {

  constructor(
    private ankiService: AnkiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  @ViewChild(QuestionDetailComponent, {static: true}) qdc!: QuestionDetailComponent;
  @ViewChild('dobInput') dobInput?: ElementRef;
  @ViewChild('kokInput') kokInput?: ElementRef;

  pendingCounts: PendingCounts = {};

  ngOnInit(): void {
    this.getQuestion()
  }

  selectedQuestion?: Question;
  prevQuestion!: Question;
  selectedCategory = new BehaviorSubject<number>(72);
  searchValue: String = "lol";

  handleSkipEvent(): void {
    const lastValue = this.selectedCategory.value;
    this.selectedCategory.next(lastValue);
  }

  handleAnswerEvent(resp: number): void {
    if (!this.selectedQuestion) {
      return;
    }
    let qid = this.selectedQuestion.id;
    console.log("answer event received in parent component!", resp, qid);
    this.ankiService.answer(qid, resp)
      .pipe(
        finalize(() => {
          console.log("Finalizing answer event");
          this.handleSkipEvent();
        }))
      .subscribe(r => {
        console.log("Answer response", r);
        if (r.data) {
          const responseData = JSON.parse(r.data);

          const question: Question = {
            id: responseData.id,
            question: responseData.question,
            answer: responseData.answer,
            next: responseData.next,
            days: responseData.days
          };
          this.prevQuestion = question;
          console.log("Previous question", question);
        }
      }
    );
  }

  
  getQuestion(): void {
    this.selectedCategory.pipe(
      switchMap(cat => this.ankiService.getAnki(cat))
    ).subscribe(q => {
      if (q) {
        let questionHead = q.question.split('\n')[0];
        q.questionHead = questionHead;
      }
      this.qdc!.show = false;
      this.selectedQuestion = q
      this.ankiService.getPendingCounts().subscribe(r => {
        console.log("pendig response", r);
        this.pendingCounts = r;
      });
    })
  }
}
