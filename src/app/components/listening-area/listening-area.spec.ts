import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningArea } from './listening-area';

describe('ListeningArea', () => {
  let component: ListeningArea;
  let fixture: ComponentFixture<ListeningArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeningArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeningArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
