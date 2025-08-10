import { Component, inject, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WorkService } from '../../services/work-service';
import { AuthService } from '../../services/authorization-service';
import { WorkModel } from '../../models/work-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../models/user-model';
import { WorkList } from "../home-lists/work-list/work-list";
import { AdminService } from '../../services/admin-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, WorkList],
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css']
})
export class UserPage implements OnInit {   
  
    [x: string]: any;

    private _router = inject(ActivatedRoute);
    private _routerPages = inject(Router);
    private _workService = inject(WorkService); 
    private _authService = inject(AuthService);
    private _userService = inject(UserService);
    
    works: WorkModel[] = [];
    image: { src: string, alt:string} | null = null;
    userHasAdminRole?: boolean = false;
    uploadedWorks = this.works;
    currentWork?: WorkModel | null = null;
    userId!: number;
    userModel?: UserModel;
    artName?: string = this._authService.decodePayload()?.artName;


    ngOnInit() {
      console.log('--- ngOnInit UserPage ---');
      console.log('Router.url:', this._routerPages.url);
      console.log('paramMap snapshot id:', this._router.snapshot.paramMap.get('id'));
      console.log('decodePayload: ', this._authService.decodePayload());

      const token = this._authService.getToken();
      if (!token) {
        setTimeout(() => this.ngOnInit(), 100);
        return;
      }
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
      }
      const payload = this._authService.decodePayload();
      this.userHasAdminRole = payload?.authorities?.includes('ROLE_ADMIN');

      const artName = payload?.artName;
      console.log("artName: " + artName);

      this._router.paramMap.subscribe(params => {
        const idParam = params.get('id');
        this.userId = idParam ? +idParam : 0;
        console.log('User corrente: ', this.userId);

        if (!this.userId) {
          console.error('ID utente non valido');
          return;
        }

        this._workService.findWorkDoneByUser(this.userId).subscribe({
          next: ws => {
            this.works = ws;
            console.log('Works caricati:', this.works);
          },
          error: err => console.error(err)
        });
        
        const savedImage = localStorage.getItem('profileImage');
        if(savedImage) {
          this.image = { src: savedImage, alt: 'Profile image' };
        }
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

    private _adminService = inject(AdminService);
    success = false;
    error: string | null = null;

    promote() {
      this.success = false;
      this.error   = null;

      this._adminService.promote(this.userId)
        .subscribe({
          next: () => {
            this.success = true;
            console.log('Promozione avvenuta con successo');
            console.log('Ruoli aggiornati:', this._authService.getUserRoles());
          },
          error: (err) => {
            this.error = err.message || 'Errore durante la promozione';
            console.error(err);
          }
        });
    }

    logOut() {
      this._routerPages.navigate(['/log-in-area']);
    }

    onDragOver(event : DragEvent): void {
      event.preventDefault();
    }

    onDrop(event: DragEvent):void {
      event.preventDefault();

      const file = event.dataTransfer?.files[0];

      if(file?.type.startsWith('image/')) {
        this.resizeImage(file).then(resizedImage => {
          localStorage.setItem('profileImage', resizedImage);
          this.image = { src: resizedImage, alt: file.name };
          this.saveProfileImage(resizedImage);
        });
      }
    }


  onDragStart(event: DragEvent):void {
    this.image = {
      src: (event.target as HTMLImageElement).src,
      alt: (event.target as HTMLImageElement).alt,
    };

    if(event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify(this.image));
    }
  }

  resizeImage(file: File, maxWidth = 200, maxHeight = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  saveProfileImage(imageBase64: string): void {
    
    this._router.paramMap.subscribe(params => {
        const idParam = params.get('id');
        const userId = idParam ? +idParam : 0;
    });
    if (this.userModel) {
      this.userModel.userId = this.userId;
    }

    if (typeof this.userId === 'number' && !isNaN(this.userId) && this.userId !== 0) {
      this._userService.updateUserProfileImage(this.userId, imageBase64).subscribe({
        next: () => {
          console.log('bella immagine, caricata con successo');
        },
        error: (err: Error) => {
          console.error('Error updating profile image:', err);
        }
      });
    } else {
      console.error('User ID is invalid, cannot update profile image.');
    }
  }

  deleteProfileImage() {
    localStorage.removeItem('profileImage');
    this.image = null;
    if (this.userModel) {
      this.userModel.profileImg = '';
    }
  }

}
