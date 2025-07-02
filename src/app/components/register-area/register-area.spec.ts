import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterArea } from './register-area';

describe('RegisterArea', () => {
  let component: RegisterArea;
  let fixture: ComponentFixture<RegisterArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
