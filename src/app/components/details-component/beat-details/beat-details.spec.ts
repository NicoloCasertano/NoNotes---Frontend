import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatDetails } from './beat-details';

describe('BeatDetails', () => {
  let component: BeatDetails;
  let fixture: ComponentFixture<BeatDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeatDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeatDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
