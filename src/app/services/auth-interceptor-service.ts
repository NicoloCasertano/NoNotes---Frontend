import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthInterceptor] Token JWT applicato a:', req.url);
      return next.handle(authReq);
    }

    if (!token) {
      console.warn('[AuthInterceptor] Nessun token JWT per:', req.url);
    } else {
      console.warn('[AuthInterceptor] Token scaduto, rimosso');
      localStorage.removeItem('jwt_token');
    }

    return next.handle(req);
  }
}

