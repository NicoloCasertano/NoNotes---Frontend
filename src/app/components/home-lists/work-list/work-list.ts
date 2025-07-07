import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { WorkModel } from '../../../models/work-model';
import { WorkService } from '../../../services/work-service';
import { UserService } from '../../../services/user-service';
import { AuthService } from '../../../services/authorization-service';
import { CommonModule } from '@angular/common';

@Component({
	standalone: true,
	selector: 'app-work-list',
	imports: [CommonModule],
	template: `
		<ul>
			<li *ngFor="let w of works" (click)="select(w)"> {{ w.title }} </li>
		</ul>`,
	styleUrl: './work-list.css'
})
export class WorkList {
	@Input() works: WorkModel[] = [];
	private _authService = inject(AuthService);

	@Output() selected = new EventEmitter<WorkModel>();

	select(w: WorkModel) { this.selected.emit(w); }
}


