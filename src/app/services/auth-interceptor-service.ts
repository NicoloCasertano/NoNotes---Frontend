import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./authorization-service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    const router = inject(Router);

    let authReq = req;

    // Includi il token su TUTTE le chiamate tranne quelle GET pubbliche
    if (!(req.url.match(/\/api\/audios\/.+$/))) {
        if (token) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        } else {
            console.warn('[Interceptor] Token non trovato');
        }
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                if (!error.url?.includes('/api/users/')) {
                    authService.logout();
                    router.navigate(['/log-in-area']);
                }
            }
            return throwError(() => error);
        })
    );
};