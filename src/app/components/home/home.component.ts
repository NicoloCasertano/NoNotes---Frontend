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
  imports: [CommonModule, WorkList],
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

    private _activatedRoute = inject(ActivatedRoute);
    private _beatService: BeatService = inject(BeatService);
    private _workService: WorkService = inject(WorkService);
    private _userService: UserService = inject(UserService);
    private _authService: AuthService = inject(AuthService);
    private _router = inject(Router);

    userId = this._authService.getUserId();

    ngOnInit():void {
      this._activatedRoute.queryParams.subscribe({
        next: params => {
          const title = params['q'];
          const user = params['user'];
          const isLogged = this._authService.isLogged();
          this.clearLists();
          if(title) {
            this.fetchByTitle(title);
          } else if(user) {
            this.clearLists();
            this.fetchByTitle(user);
          } else {
            if(!isLogged) {
              this.fetchAll();
            } 
          }
        }
      })
    }
    createQueryString(filters: Partial<SearchModel>): string {
      let queryString: string = '?';
      if(filters.title?.length === 0) {
        filters.title = undefined;
      }
      for(const key in filters) {
        const value = filters[key as keyof SearchModel];

        if(value !== undefined && value !== null && value !== '') {
          queryString += key + '=' + value + '&';
        }
      }
      return queryString;
    }
    fetchAll() {
      console.log('All');
      const sort = 'orderByDataDiCreazioneDesc';
      const filters: Partial<SearchModel> = { sort };
      this.fetchPreSearchResults(filters);
      return;
    }

    fetchPreSearchResults(filters: Partial<SearchModel>): void {
      const queryString = this.createQueryString(filters);

      this._workService.findByFilters(queryString).subscribe({
        next: workListDb => {
          this.workList = workListDb;
        },
        error: e => {
          console.log("Errore nella ricerca degli Work: ", e);
        }
      })

      this._beatService.findByFilters(queryString).subscribe({
            next: beatsListDb => {
                this.beatsList = beatsListDb;
            },
            error: e => {
                console.log("Errore nella ricerca dei Beat: ", e);
            }
      });
    }

    executeSearch(filters: Partial<SearchModel>) {
      this.beatsList = [];
      this.workList = [];
      console.log("Advanced");
      const queryString = this.createQueryString(filters);
    }

    fetchUserByName(user: string){
      this._userService.getUtentiByUsername(user).subscribe({
        next: list => this.userList = list,
        error: e => console.log('---------------- errore nel caricamento utenti -----------------')
      });
    }

    fetchByTitle(title: string) {
      console.log('byTitle');
      this._workService.findByName(title).subscribe({
        next: workListDb => {
          this.workList = workListDb;
        },
        error: e => {
          console.log("====================================================");
          console.log("la ricerca findByName Work non ha trovato risultati");
          console.log("====================================================");
        }
      });
      this._beatService.findByName(title).subscribe({
        next: beatListDb => {
          this.beatsList = beatListDb;
        },
        error: e => {
          console.log("====================================================");
          console.log("la ricerca findByName Beat non ha trovato risultati");
          console.log("====================================================");
        }
      });
    }
    clearLists() {
      this.workList = [];
      this.beatsList = [];
      this.userList = [];
    }
    closeAdv() {
      const advDiv = document.querySelector('#advSe') as HTMLElement;
      const main = document.querySelector('app-home-component>main ') as HTMLElement;
      const liste = document.querySelector('#viewArea ') as HTMLElement; 
      this.isAdvClosed = !this.isAdvClosed;

      if (this.isAdvClosed) {
          advDiv.style.width = '0px'; // Hide it
          advDiv.style.opacity = "0";
          main.style.gridTemplateColumns = '0% 3% 97%'
          advDiv.hidden =true;
          liste.style.width = '93vw'
          advDiv.style.left = "0px";

      } else {
          advDiv.style.width = ''; // Reset to CSS default
          main.style.gridTemplateColumns = '20% 3% 77%'
          advDiv.style.opacity = "1";
          advDiv.hidden =false;
          liste.style.width = '74vw'
          advDiv.style.left = "100px";
          
      }
    }
    goToUserPage() {
      this._router.navigate(['/user', this.userId]);
    }
}
