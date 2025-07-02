import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatList } from './beat-list';

describe('BeatList', () => {
  let component: BeatList;
  let fixture: ComponentFixture<BeatList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeatList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeatList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
