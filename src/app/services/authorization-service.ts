import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RouteConfigLoadEnd, Router } from "@angular/router";
import { jwtDecode } from 'jwt-decode';
import { RegistrationRequestModel } from "../models/registration-request-model";
import { Observable } from "rxjs";
import { JwtTokenModel } from "../models/jwt-token-model";
import { LoginRequestModel } from "../models/login-request-model";
import { JwtPayloadModel } from "../models/jwt-payload-model";
import { environment } from "../../environment";

@Injectable({providedIn: 'root'})
export class AuthService {

    private _url: string = `${environment.apiUrl}/authentications`;
    private _http = inject(HttpClient);
    private _router = inject(Router);
    private tokenKey = 'jwt_token';

    register(data: { name: string, email: string; password: string}): Observable<JwtTokenModel>{
        return this._http.post<JwtTokenModel>(`${this._url}/register-area`, data);

    }

    login(credentials: { email:string; password: string}): Observable<JwtTokenModel> {
        return this._http.post<JwtTokenModel>(`${this._url}/log-in-area`, credentials)
        // this._http.post<JwtTokenModel>(`${this._url}/login`,logreq).subscribe({
        //     next: (authToken) =>{
        //         localStorage.setItem("jwt",authToken.token );
        //         console.log("Authenticated as "+ logreq.email);
        //         this._router.navigate(['/home']);
        //     },
        //     error: e => alert('Errore nel accesso')
        // });
    }

    logout() {
        localStorage.removeItem('jwt_token');
        console.log("Logged out");
    }

    isLogged(): boolean {
        const token = this.getToken();
        if(!token) return false;

        const decoded = jwtDecode<JwtPayloadModel> (token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now;
        
    }

    getToken():string|null {
        return localStorage.getItem("jwt_token");
    }

    getUserId():string|null {
        const token = this.getToken();
        if(!token) return null;
        try {
            const decoded = jwtDecode<JwtPayloadModel>(token);
            return decoded.userId || null;
        } catch (e) {
            console.error('Errore nel decodificare il token: ', e);
            return null;
        }
        
    }
    setToken(token:string) {
        localStorage.setItem(this.tokenKey, token);
    }
}