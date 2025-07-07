import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorization-service';
import { WorkService } from '../../services/work-service';
import { WorkModel } from '../../models/work-model';

interface Work {
	title: string;
	bpm: string;
	key: string;
	artName: string;
	dataDiCreazione: string;
	audioFile?: File;
}
@Component({
	standalone: true,
	selector: 'app-upload-work',
	templateUrl: './upload-work.html',
	styleUrls: ['./upload-work.css'],
	imports: [FormsModule, CommonModule]
})
export class UploadWork {
	work: Partial<WorkModel> = {};  
	file?: File;
	keys = ['A', 'A#', 'B','C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

	private _router = inject(Router);
	private _authService = inject(AuthService);
	userId = this._authService.getUserId();
	private _workService = inject(WorkService);

	constructor(private http: HttpClient) {}

	onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		if(event.dataTransfer?.files.length) {
		this.file = event.dataTransfer.files[0];
		}
	}

	submitWork() {
		if(!this.file) return;

		const dto: any = {
			title: this.work.title,
			bpm: this.work.bpm,
			key: this.work.key,
			dataDiCreazione: new Date().toISOString,
			userId: this._authService.getUserId()
		};
		
		this.work.dataDiCreazione = new Date();
		const form = new FormData();
		form.append('file', this.file!);
		Object.entries(dto).forEach(([k, v]) => form.append(k, v!.toString()));
		this._workService.createWork(form).subscribe({
			next: w => {
				console.log('Work caricato con successo', w);
				//this._router.navigate(['/user', this._authService.getUserId()]);
			},
			error: e => console.error(e)
		});
	}

	goToUserPage() {
		this._router.navigate(['/user', this.userId]);
	}
	goToHome() {
		this._router.navigate(['/home']);
	}
}
