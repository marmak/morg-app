import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceKokComponent } from './datasource-kok.component';

describe('DatasourceKokComponent', () => {
  let component: DatasourceKokComponent;
  let fixture: ComponentFixture<DatasourceKokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasourceKokComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatasourceKokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
