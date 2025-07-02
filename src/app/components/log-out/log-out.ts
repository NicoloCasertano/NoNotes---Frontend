import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/authorization-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  imports: [],
  templateUrl: './log-out.html',
  styleUrl: './log-out.css'
})
export class LogOut implements OnInit{
    private _authService = inject(AuthService);
    private _router = inject(Router);

    ngOnInit(): void {
        this._authService.logout();
        this._router.navigate(['/home']);
    }
}
