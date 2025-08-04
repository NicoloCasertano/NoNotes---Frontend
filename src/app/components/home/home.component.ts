import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnDestroy, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy{
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

    images: string[] = [
      'https://imgur.com/fhg4ndx.jpg',
      'https://imgur.com/gWv19UR.jpg',
      'https://imgur.com/TZibG8P.jpg',
      'https://imgur.com/O4lQBA8.jpg',
      'https://imgur.com/aPlYx1j.jpg'
    ];
    currentImageIndex = 1;
    private intervalId: any;
    transitionStyle = 'transform 1.5s ease-in-out';

    ngOnInit(): void {
      this.startSlideShow();
    }

    ngOnDestroy(): void {
      clearInterval(this.intervalId);
    }

    startSlideShow(): void {
      this.intervalId = setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      }, 5500);
    }

    getTransform(): string {
      return `translateX(-${this.currentImageIndex * 100}%)`;
    }
    get imagesToShow(): string[] {
      // Duplico la prima immagine alla fine
      return [...this.images, this.images[0]];
    }
    get visibleImages() {
      if (this.images.length === 0) return [];
      return [this.images[this.images.length - 1], ...this.images, this.images[0]];
    }

    prevImage(): void {
      this.currentImageIndex--;
      this.transitionStyle = 'transform 0.5s ease-in-out';
    }
    
    nextImage(): void {
      this.currentImageIndex++;
      this.transitionStyle = 'transform 0.8s ease-in-out';
    }

    handleTransitionEnd(): void {
      // Se siamo sull'immagine duplicata (ultima), resetta senza transizione
      if (this.currentImageIndex === this.images.length + 1) {
        this.transitionStyle = 'none';
        this.currentImageIndex = 1;
        // // forza il cambio dopo il frame
        setTimeout(() => {
          this.transitionStyle = 'transform 0.8s ease-in-out';
        });
      }
      if(this.currentImageIndex === 0) {
        this.transitionStyle = 'none';
        this.currentImageIndex = this.images.length;
      }
    }
}
