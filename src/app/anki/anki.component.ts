import { Component, ElementRef, ViewChild } from '@angular/core';
import {NgIf, UpperCasePipe} from '@angular/common';
import { Question } from '../question';
import { AnkiService } from '../anki.service';
import { QuestionDetailComponent } from '../question-detail/question-detail.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-anki',
  standalone: true,
  imports: [NgIf, QuestionDetailComponent, FormsModule],
  templateUrl: './anki.component.html',
  styleUrl: './anki.component.css'
})
export class AnkiComponent {

  constructor(private ankiService: AnkiService) {}

  @ViewChild(QuestionDetailComponent, {static: true}) qdc!: QuestionDetailComponent;
  @ViewChild('dobInput') dobInput?: ElementRef;
  @ViewChild('kokInput') kokInput?: ElementRef;


  ngOnInit(): void {
    this.getQuestion()
  }

  selectedQuestion!: Question;
  prevQuestion!: Question;
  selectedCategory: number = 72;
  searchValue: String = "lol";

  
  selectCategory(c: number): void {
    console.log("selected cate", c);
    console.log(this.dobInput);;
    console.log(this.kokInput);;
    this.selectedCategory = c;
    this.getQuestion();
  }
  
  handleSkipEvent(): void {
    console.log("Skip event received in parent component!");
    this.getQuestion();
  }

  handleAnswerEvent(resp: number): void {
    let qid = this.selectedQuestion.id;
    console.log("answer event received in parent component!", resp, qid);
    this.ankiService.answer(qid, resp).subscribe(r => {
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
      this.getQuestion();
    }
    );
  }

  
  getQuestion(): void {
    console.log("Getting question from service");
    this.ankiService.getAnki(this.selectedCategory).subscribe(q => this.selectedQuestion = q)
  }

}
