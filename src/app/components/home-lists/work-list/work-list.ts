import { Component, Input } from '@angular/core';
import { WorkModel } from '../../../models/work-model';

@Component({
  selector: 'app-work-list',
  imports: [],
  templateUrl: './work-list.html',
  styleUrl: './work-list.css'
})
export class WorkList {
  @Input('works') works: WorkModel[] = [];
}
