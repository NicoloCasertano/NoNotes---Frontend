import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Admin } from "../components/admin/admin";
import { UserModel } from "../models/user-model";

@Injectable({providedIn: 'root'})
export class AdminService {
    private _url: string = 'http://localhost:8080/api/admins';
    private _http = inject(HttpClient);
    private _router = inject(Router);

    getAll():Observable<UserModel[]> {
        return this._http.get<UserModel[]>(this._url);
    }

    promote(id:number) {
        return this._http.put(`${this._url}/${id}/role`, null);
    }

    delete(id:number) {
        return (this._http.delete(`${this._url}/${id}`));
    }
}