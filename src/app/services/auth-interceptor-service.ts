import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "./authorization-service";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    // Paths pubblici: login, register e GET audio
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/audios/'
    ];
    // Controlla se l'URL corrisponde a uno dei path pubblici
    const isPublic = publicPaths.some(path => req.url.includes(path));

    let authReq = req;
    if (!isPublic) {
      if (token) {
        authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
      } else {
        console.warn('[Interceptor] Token non trovato');
      }
    }
    return next.handle(authReq);
  }
}

