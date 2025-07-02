import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AudioModel } from "../models/audio-model";
import { PageResponse } from "../models/page-response-model";

@Injectable({providedIn: 'root'})
export class AudioService {
    private _url = "http://localhost:8080/api/audios";
    private _http = inject(HttpClient);

    findAll(): Observable<AudioModel[]> {
        return this._http.get<AudioModel[]>(this._url);
    }

    finByName(name:string|undefined): Observable<AudioModel[]>{
        return this._http.get<PageResponse<AudioModel>>(`${this._url}?name=${name}`).pipe(map(page => page.content));
    }

    findByFilters(queryString:string): Observable<AudioModel[]> {
        return this._http.get<PageResponse<AudioModel>>(`${this._url}${queryString}`)
                         .pipe(map(page => page.content));
    }

    getById(id: number): Observable<AudioModel> {
        return this._http.get<AudioModel>(`${this._url}/${id}`);
    }

    findAudioDoneByUser(id:number): Observable<AudioModel[]> {
        return this._http.get<AudioModel[]>(`${this._url}/user/${id}`)
    }
}
