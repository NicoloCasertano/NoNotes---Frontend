import { HttpClient, HttpHeaders, HttpParams, httpResource } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { UserNoPassModel } from "../models/user-nopass-model";
import { UserModel } from "../models/user-model";
import { AuthService } from "./authorization-service";
import { environment } from "../../environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _url: string = "http://localhost:8080/api/users";
    private _http: HttpClient = inject(HttpClient);
    private _authService = inject(AuthService);

    getUtentiByUsername(userName: string):Observable<UserNoPassModel[]>{
        return this._http.get<UserNoPassModel[]>(`${this._url}/${userName}`);
    }

    getUtenteByUtenteId(userId: number):Observable<UserNoPassModel>{
        return this._http.get<UserNoPassModel>(`${this._url}/${userId}`);
    }

    getUserByArtName(artName: string):Observable<UserModel[]> {
        return this._http.get<UserModel[]>(`${this._url}/${artName}`);
    }

    getUserById(userId: number) {
        return this._http.get<UserModel>(`${this._url}/${userId}`);
    }

    private getAuthHeaders() {
        const token = localStorage.getItem('jwt_token');
        const headers = token
            ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
            : new HttpHeaders();
        return { headers };
    }

    updateUserRole(userId: number): Observable<UserModel> {
        const newRole: string = 'ADMIN'
        const params = new HttpParams().set('role', newRole);
        return this._http.put<UserModel>(
            `${this._url}/${userId}/role`,
            null,
            { params }
        );
    }
    getAllUsers(): Observable<UserModel[]> {
        return this._http.get<UserModel[] | UserModel>(`${this._url}/all`)
        .pipe(
            map(res => Array.isArray(res) ? res : [res]),
            catchError(err => {
                console.error('Errore HTTP getAllUsers', err);
                return of([] as UserModel[]);
            })
        );
    }
}