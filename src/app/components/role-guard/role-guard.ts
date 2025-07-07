import { Component, inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/authorization-service';
import { routes } from '../../app.routes';

@Component({
	selector: 'app-role-guard',
	imports: [],
	templateUrl: './role-guard.html',
	styleUrl: './role-guard.css'
})
@Injectable({ providedIn: 'root'})
export class RoleGuard implements CanActivate {
	private _router = inject(Router);
	private _authService = inject(AuthService);
	constructor(_authService: AuthService, _router: Router) {};

	canActivate(route: ActivatedRouteSnapshot): boolean {
		const expectedRoles: string[] = route.data['roles'];
		const userRoles = this._authService.getUserRoles();
		const ok = expectedRoles.some(r => userRoles.includes(r));
		if(!ok) {
			this._router.navigate(['/home']);
		}
		return ok;
	}

}
