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
		this.work.dataDiCreazione = new Date();
		this._workService.createWork(this.file, this.work).subscribe({
			next: w => {
				console.log('Work caricato con successo', w);
				this._router.navigate(['/user-page', this._authService.getUserId()]);
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
