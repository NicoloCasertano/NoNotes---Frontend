import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorization-service';
import { WorkService } from '../../services/work-service';
import { UserService } from '../../services/user-service';
import { jwtDecode } from 'jwt-decode';
import { UserModel } from '../../models/user-model';
import { ListeningArea } from '../listening-area/listening-area';
import { WorkDto } from '../../models/dto/work-dto';

@Component({
	standalone: true,
	selector: 'app-upload-work',
	templateUrl: './upload-work.html',
	styleUrls: ['./upload-work.css'],
	imports: [FormsModule, CommonModule]
})
export class UploadWork implements OnInit{
	
	private _router = inject(Router);
	private _authService = inject(AuthService);
	private _workService = inject(WorkService);
	private _userService = inject(UserService);

	work: {
		title?: string,
		artName?: string,
		bpm?: number,
		key?: string,
		dataDiCreazione?: Date
  	} = {};  
	file?: File;
	keys = ['A min', 'A# min', 'B min','C min', 'C# min', 'D min', 'D# min', 'E min', 'F min', 'F# min', 'G min', 'G# min', 
		'A', 'A#', 'B','C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'
	];

	userId = this._authService.getUserId();
	isAdmin = false;
	currentArtName = '';
	targetName = '';
	users: UserModel[] = [];
	artNames: string[] = [];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		const roles = this._authService.getUserRoles();
		this.isAdmin = Array.isArray(roles) && roles?.includes('ROLE_ADMIN');
		const payload: { [key: string]: any } = JSON.parse(JSON.stringify('userId'));
		
		this.getAllArtNames();
		this.isAdmin = payload?.['roles']?.includes('ROLE_ADMIN') || false;
		// if (!this.isAdmin) {
		// 	this.currentArtName = payload?.['artName'] || '';
		// }
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	onDragLeave(event: DragEvent) {
  		event.preventDefault();
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		if(event.dataTransfer?.files.length) {
			this.file = event.dataTransfer.files[0];
		}
	}
	onFileSelected(ev: Event) {
		const input = ev.target as HTMLInputElement;
		this.file = input.files?.[0];

	}

	getAllArtNames() {
		this._userService.getAllUsers().subscribe({
			next: (users: UserModel[]) => {
				if(!users || !Array.isArray(users)) {
					this.artNames = [];
					return;
				}
				this.users = users;
				this.artNames = users
				.map(u => u.artName)
				.filter((name, idx, arr) => !!name && arr.indexOf(name) === idx);
			},
			error: err => console.error('Errore recupero utenti', err)
		});
	}

	submitWork() {
		if(!this.file || !this.work.title || !this.work.artName || !this.work.bpm || !this.work.key) return;

		this.isAdmin = this._authService.getUserRoles()?.includes('ROLE_ADMIN') || false;
		
		const formData = new FormData();
		formData.append('file', this.file);
		formData.append('title', this.work.title);
		formData.append('bpm', this.work.bpm.toString());
		formData.append('key', this.work.key);
		formData.append(
			'dataDiCreazione',
			this.work.dataDiCreazione ? (this.work.dataDiCreazione).toISOString() : new Date().toISOString());
		formData.append('artName', this.work.artName);
		this._workService.createWork(this.work);
		this._workService.uploadWork(formData).subscribe({
			next: (createdWork) => {
				console.warn('Work upload completato con successo');
				this._router.navigate([`/listening-area/${createdWork.workId}`]);
			},
			error: (err) => {
				console.error('Errore nel salvataggio del work: ', err);
				alert('Errore nel salvataggio del work. Spiacenti, riprova più tardi');
			}
		});
	}

	goToUserPage() {
		this._router.navigate(['/user', this.userId]);
	}
	goToHome() {
		this._router.navigate(['/home']);
	}
}
