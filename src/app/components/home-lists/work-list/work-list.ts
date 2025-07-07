import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { WorkModel } from '../../../models/work-model';
import { WorkService } from '../../../services/work-service';
import { UserService } from '../../../services/user-service';
import { AuthService } from '../../../services/authorization-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
	standalone: true,
	selector: 'app-work-list',
	imports: [CommonModule, RouterModule],
	template: `
		<ul>
			<li *ngFor="let w of works" (click)="select(w)"> {{ w.title }} </li>
		</ul>`,
	styleUrl: './work-list.css'
})
export class WorkList implements OnInit {
	@Input() works: WorkModel[] = [];
	@Output() selected = new EventEmitter<WorkModel>();

	userId!: number;

	constructor(
		private _router: ActivatedRoute,
		private _workService: WorkService
	) {}
	select(w: WorkModel) { this.selected.emit(w); }

	ngOnInit() {
		this._router.paramMap.subscribe(params => {
			this.userId = +(params.get('id')|| '0');
			if (this.userId) {
				this._workService.findWorkDoneByUser(this.userId).subscribe(ws => this.works = ws);
			}
		});
	}
}


