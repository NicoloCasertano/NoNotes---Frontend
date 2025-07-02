import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInArea } from './log-in-area';

describe('LogInArea', () => {
  let component: LogInArea;
  let fixture: ComponentFixture<LogInArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogInArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogInArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
