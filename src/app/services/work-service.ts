import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { WorkModel } from "../models/work-model";
import { map, Observable } from "rxjs";
import { Title } from "@angular/platform-browser";
import { PageResponse } from "../models/page-response-model";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class WorkService {
    private _url: string = 'http://localhost:8080/api/works';
    private _http = inject(HttpClient);
    private _router = inject(Router);

    findAllWorks(): Observable<WorkModel[]> {
        return this._http.get<WorkModel[]>(this._url);
    }

    findByTitle(title:string): Observable<WorkModel[]> {
        return this._http.get<WorkModel[]>(`${this._url}?title=${title}`);
    }

    searchWork(queryString:string): Observable<WorkModel[]> {
        return this._http.get<WorkModel[]>(`${this._url}/search${queryString}`);
    }

    findWorkDoneByUser(userId:number): Observable<WorkModel[]> {
        return this._http.get<WorkModel[]>(`${this._url}/by-user/${userId}`);
    }

    createWork(form: FormData): Observable<WorkModel> {
        return this._http.post<WorkModel>(this._url, form);
    }

    updateWork(id: number, updates: Partial<WorkModel>): Observable<WorkModel> {
        return this._http.put<WorkModel>(`${this._url}/${id}`, updates);
    }


}