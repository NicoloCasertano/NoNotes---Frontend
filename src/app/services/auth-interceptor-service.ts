import { HttpErrorResponse, HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./authorization-service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    const router = inject(Router);

    let authReq = req;

    if (
        !(
            req.url.includes('/api/works/upload') ||  
            req.url.match(/\/api\/audios\/.+$/)   ||  
            (req.method === 'GET' && req.url.match(/\/api\/works\/\d+$/))
        )
    ) {
        if (token) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }
    }
    console.log('Outgoing request:', {
        url: req.url,
        method: req.method,
        headers: req.headers.keys().reduce((acc, key) => {
            acc[key] = req.headers.get(key);
            return acc;
        }, {} as any)
    });
    console.log('Request:', authReq.method, authReq.urlWithParams, authReq.headers);

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('HTTP error:', error);

            if (error.status === 401 || error.status === 403) {
                authService.logout();
                router.navigate(['/log-in-area']);
                return throwError(() => new Error("Sessione scaduta o ruolo non valido"));
            }

            return throwError(() => error);
        })
    );
};