import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAreaComponent } from './register-area';

describe('RegisterArea', () => {
  let component: RegisterAreaComponent;
  let fixture: ComponentFixture<RegisterAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
