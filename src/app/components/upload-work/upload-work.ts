import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorization-service';

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
  work: Work = {
    title: '',
    bpm: '',
    key: '',
    artName: '',
    dataDiCreazione: ''
  };  
  
  keys = ['A', 'A#', 'B','C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

  private _router = inject(Router);
  private _authService = inject(AuthService);
  userId = this._authService.getUserId();

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if(event.dataTransfer?.files.length) {
      this.work.audioFile = event.dataTransfer.files[0];
    }
  }

  submitWork() {
    if(!this.work.audioFile) return;
    
    const formData = new FormData();
    formData.append('file', this.work.audioFile);
    formData.append('bpm', this.work.bpm);
    formData.append('key', this.work.key);
    formData.append('artName', this.work.artName);
    formData.append('audioFile', this.work.audioFile);
    formData.append('dataDiCreazione', new Date().toISOString());
    const user = this._authService.getUserId();
    
    this.http.post('/api/works', formData).subscribe({
      next: (res) => console.log('Work caricato', res),
      error: (err) => console.error('Errore', err),
    });
  }
  goToUserPage() {
    this._router.navigate(['/user', this.userId]);
  }
  goToHome() {
    this._router.navigate(['/home']);
  }
}
