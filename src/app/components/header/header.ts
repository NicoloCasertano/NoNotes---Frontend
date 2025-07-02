import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/authorization-service';

@Component({
	selector: 'app-header',
	imports: [RouterModule, FormsModule],
	templateUrl: './header.html',
	styleUrl: './header.css'
})
export class Header {
	private _router = inject(Router);
	private _authService = inject(AuthService);
	title!: string;
	user!: string;
	selectedSearch: string = 'titles';

	get isAlreadyLogged() {
		return this._authService.isLogged();
	}
	get isInLoginPage() {
		return this._router.url.includes('/login') || this._router.url.includes('/register');
	}

	send() {
		if (this.selectedSearch === 'titles') {
			this._router.navigate(['/home'], { queryParams: { q: this.title } });
		} else if(this.selectedSearch === 'users') {
			this._router.navigate(['/home'], { queryParams: { user: this.user } });
		}
		this.selectedSearch = 'titles';
		this.title = '';
		this.user = '';
	}
	navToHome() {
		this._router.navigate(['/home']);
	}
}
