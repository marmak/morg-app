import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDlgComponent } from './question-dlg.component';

describe('QuestionDlgComponent', () => {
  let component: QuestionDlgComponent;
  let fixture: ComponentFixture<QuestionDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDlgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
