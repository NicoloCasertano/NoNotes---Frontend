import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WorkService } from '../../services/work-service';
import { UserModel } from '../../models/user-model';
import { UserService } from '../../services/user-service';
import { UserNoPassModel } from '../../models/user-nopass-model';
import { AuthService } from '../../services/authorization-service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css'
})
export class UserPage {
  private _router = inject(ActivatedRoute);
  private _routerPages = inject(Router);
  private _workService = inject(WorkService); 
  private _authService = inject(AuthService);

  userId!: string;

  ngOnInit() {
    this._router.paramMap.subscribe(params => {
      this.userId = params.get('id')!;
      console.log('User corrente: ', this.userId);
    });
  }

  goToHome() {
    this._routerPages.navigate(['/home'])
  }
  showUserWorks(userId: string) {
    this._authService.getUserId();
    this._workService.findWorkDoneByUser(userId);
    console.log(userId);
    console.log(this._workService.findWorkDoneByUser);
    this._routerPages.navigate(['/work-list']);
  }

}
