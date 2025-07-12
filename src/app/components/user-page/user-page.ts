import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WorkService } from '../../services/work-service';
import { AuthService } from '../../services/authorization-service';
import { WorkList } from "../home-lists/work-list/work-list";
import { ListeningArea } from "../listening-area/listening-area";
import { WorkModel } from '../../models/work-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadWork } from '../upload-work/upload-work';
import { UserService } from '../../services/user-service';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [WorkList, CommonModule, FormsModule, RouterModule],
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css']
})
export class UserPage implements UserModel {
  userName!: string;
  password!: string;
  email!: string;
  artName!: string;

  private _router = inject(ActivatedRoute);
  private _routerPages = inject(Router);
  private _workService = inject(WorkService); 
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  currentWork: WorkModel | null = null;
  works: WorkModel[] = [];
  userId!: number;

  ngOnInit() {
    console.log('--- ngOnInit UserPage ---');
    console.log('decodePayload: ', this._authService.decodePayload());
    console.log('Router.url:', this._routerPages.url);
    console.log('paramMap snapshot id:', this._router.snapshot.paramMap.get('id'));
    this._router.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam ? +idParam : 0;
      console.log('User corrente: ', this.userId);
      console.log('URL attuale: ', this._routerPages.url);

      const payload = this._authService.decodePayload();
      this.userName = payload?.sub || '';
      this.getUserArtName();
      console.log(this.artName);
      this._userService.getUserById(this.userId).subscribe(user => {
        console.log('User response:', user);
      });
    });
    
  }
  onSelect(work: WorkModel): void {
    this.currentWork = work;
  }
  goToHome() {
    this._routerPages.navigate(['/home']);
  }
  goToUploadWork() { 
    this._routerPages.navigate(['/upload-work', this.userId]);
  }
  showUserWorks(userId: number) {
    if(!this.userId) return;

    this._workService.findWorkDoneByUser(this.userId).subscribe({
    next: ws => {
      this.works = ws; 
      console.log('Works caricati:', this.works);
    },
    error: err => console.error(err)
    });
    console.log(userId);
  }
  hasWorks(works: WorkModel[]) {
    if(!works){
        console.log('non ci sono lavori per questo user')
    }
  }
  getUserArtName():string{
    this._userService.getUserById(this.userId).subscribe(user => {
      this.artName = user?.artName ?? '';  
    });
    return this.artName;
  }
}
