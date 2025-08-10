import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPage } from './open-page';

describe('OpenPage', () => {
  let component: OpenPage;
  let fixture: ComponentFixture<OpenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
