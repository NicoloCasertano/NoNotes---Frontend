import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadWork } from './upload-work';

describe('UploadWork', () => {
  let component: UploadWork;
  let fixture: ComponentFixture<UploadWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
