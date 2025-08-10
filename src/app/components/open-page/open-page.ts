import { Component, inject } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-open-page',
  imports: [],
  templateUrl: './open-page.html',
  styleUrl: './open-page.css',
})
export class OpenPage {
    isExiting = false;
    constructor(private _router: Router) {}

    ngOnInit() {
      setTimeout(() => {
        this.startExitTransition();
      }, 7000);
    }

    startExitTransition() {
      this.isExiting = true;
      setTimeout(() => {
        this._router.navigate(['/log-in-area']);
      }, 2000);
    }
  }
