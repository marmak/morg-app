import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgIf, UpperCasePipe} from '@angular/common';
import { Question } from '../question';
import { AnkiService } from '../anki.service';
import { QuestionDetailComponent } from '../question-detail/question-detail.component';

@Component({
  selector: 'app-anki',
  standalone: true,
  imports: [NgIf, QuestionDetailComponent],
  templateUrl: './anki.component.html',
  styleUrl: './anki.component.css'
})
export class AnkiComponent {
  constructor(private ankiService: AnkiService) {}


  ngOnInit(): void {
    this.getQuestion()
  }
  
  selectedQuestion!: Question;
  prevQuestion!: Question;

  handleSkipEvent(): void {
    // Handle the skip event here
    console.log("Skip event received in parent component!");
    this.getQuestion();
  }

  handleAnswerEvent(resp: number): void {
    // Handle the skip event here
    let qid = this.selectedQuestion.id;
    console.log("answer event received in parent component!", resp, qid);
    this.ankiService.answer(qid, resp).subscribe(r => {
      console.log(r);
      this.prevQuestion = this.selectedQuestion;
      this.getQuestion();
    }
    );
  }

  
  getQuestion(): void {
    console.log("Getting question from service");
    this.ankiService.getAnki().subscribe(q => this.selectedQuestion = q)
  }

}
