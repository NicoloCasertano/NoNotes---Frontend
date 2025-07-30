import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt_token');

    // Solo se il token è presente
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('[AuthInterceptor] ✅ Token JWT applicato alla richiesta:', req.url);
      return next.handle(authReq);
    }

    // Nessun token presente → procedi senza modificare la richiesta
    console.warn('[AuthInterceptor] ⚠️ Nessun token JWT trovato per:', req.url);
    return next.handle(req);
  }
}