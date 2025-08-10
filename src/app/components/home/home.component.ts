import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { UserModel } from '../../models/user-model';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('animatedText') animatedText!: ElementRef<HTMLParagraphElement>;

    [x: string]: any;
    beatsList!: BeatModel[];
    searchTerm!: string;
    workList!: WorkModel[];
    userList!: UserNoPassModel[];
    isAdvClosed = false;
   
    private _authService: AuthService = inject(AuthService);
    private _router = inject(Router);

    artName = this._authService.decodePayload()?.artName;

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
    loopedImages: string[] = [];
    offsetX = 0;
    speed = 0.3;
    animationFrameId: number | null = null;
    

    ngOnInit(): void {
      this.loopedImages = [...this.images, ...this.images];
      this.startAnimation();
    }
    
    ngAfterViewInit(): void {
      const lines = this.animatedText.nativeElement.querySelectorAll('.line');

      lines.forEach((line, lineIndex) => {
        const text = line.textContent?.trim() || '';
        line.textContent = '';

        for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.textContent = text[i];
          span.style.opacity = '0';
          span.style.display = 'inline-block';
          span.style.transform = 'translateX(10px)';
          // NON impostare l'animazione qui, si attiva solo al hover
          span.style.setProperty('--line-index', lineIndex.toString());
          span.style.setProperty('--letter-index', i.toString());
          line.appendChild(span);
        }
      });
    }

    ngOnDestroy(): void {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    startAnimation() {
      const totalWidth = this.images.length * 392.44;
      const step = () => {
        this.offsetX -= this.speed;
        
        if(Math.abs(this.offsetX) >= totalWidth) {
          this.offsetX += totalWidth;
        }

        this.animationFrameId = requestAnimationFrame(step);
      };
      step();
    }
}
