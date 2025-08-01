import { CommonModule } from '@angular/common';
import { Component, inject, NgModule } from '@angular/core';
import { BeatModel } from '../../models/beat-model';
import { ActivatedRoute, Router } from '@angular/router';
import { BeatService } from '../../services/beat-service';
import { WorkService } from '../../services/work-service';
import { UserNoPassModel } from '../../models/user-nopass-model';
import { UserService} from '../../services/user-service';
import { AuthService } from '../../services/authorization-service';
import { SearchModel } from '../../models/search-model';
import { WorkModel } from '../../models/work-model';
import { WorkList } from "../home-lists/work-list/work-list";


@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    [x: string]: any;
    beatsList!: BeatModel[];
    searchTerm!: string;
    workList!: WorkModel[];
    userList!: UserNoPassModel[];
    isAdvClosed = false;

    private _authService: AuthService = inject(AuthService);
    private _router = inject(Router);


    goToUserPage() {
      this._router.navigate(['/user', this._authService.getUserId()]);
    }
}
