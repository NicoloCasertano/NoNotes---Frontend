import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { BeatModel } from "../models/beat-model";
import { PageResponse } from "../models/page-response-model";

@Injectable({ providedIn: 'root'})
export class BeatService {
    private _url: string = 'http://localhost:8080/api/beats';
    private _http = inject(HttpClient);

    findAll(): Observable<BeatModel[]> {
        return this._http.get<BeatModel[]>(this._url);
    }

    findByName(beatTitle: string): Observable<BeatModel[]> {
        return this._http.get<PageResponse<BeatModel>>(`${this._url}?beat-title=${beatTitle}`).pipe(map(page => page.content));
    }

    findByFilters(queryString:string): Observable<BeatModel[]> {
        return this._http.get<PageResponse<BeatModel>>(`${this._url}${queryString}`).pipe(map(page => page.content));
    }

    getById(id: number): Observable<BeatModel> {
        return this._http.get<BeatModel>(`${this._url}/${id}`);
    }

    findBeatDoneByUser(id:number): Observable<BeatModel[]> {
        return this._http.get<BeatModel[]>(`${this._url}/user/${id}`)
    }
}