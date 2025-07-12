import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UserNoPassModel } from "../models/user-nopass-model";
import { UserModel } from "../models/user-model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _url: string = 'http://localhost:8080/api/users';
    private _http: HttpClient = inject(HttpClient);

    getUtentiByUsername(userName: string):Observable<UserNoPassModel[]>{
        return this._http.get<UserNoPassModel[]>(`${this._url}/username/${userName}`);
    }

    getUtenteByUtenteId(userId: number):Observable<UserNoPassModel>{
        return this._http.get<UserNoPassModel>(`${this._url}/${userId}`);
    }

    getUserByArtName(artName: string):Observable<UserModel[]> {
        return this._http.get<UserModel[]>(`${this._url}/${artName}`);
    }

    promoteUser(userId: string, newRole: string = 'ADMIN') {
        return this._http.put(`/api/users/${userId}/role`, null, {
            params: new HttpParams().set('role', newRole)
        });
    }

    getUserById(userId: number):Observable<UserModel> {
        return this._http.get<UserModel>(`${this._url}/${userId}`);
    }

}