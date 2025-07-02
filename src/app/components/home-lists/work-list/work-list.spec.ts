import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkList } from './work-list';

describe('WorkList', () => {
  let component: WorkList;
  let fixture: ComponentFixture<WorkList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
