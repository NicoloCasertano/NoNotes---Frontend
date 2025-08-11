import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { WorkModel } from "../models/work-model";
import { map, Observable } from "rxjs";
import { Title } from "@angular/platform-browser";
import { PageResponse } from "../models/page-response-model";
import { Router } from "@angular/router";
import { AudioService } from "./audio-service";
import { WorkDto } from "../models/dto/work-dto";

@Injectable({providedIn: 'root'})
export class WorkService {
    private _url: string = 'http://localhost:8080/api/works';
    private _http = inject(HttpClient);
    private _router = inject(Router);
    private _audioService = inject(AudioService);

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
        return this._http.get<WorkModel[]>(`${this._url}/by-user/${userId}`)
            .pipe(map(ws => ws.map(this.toWorkModel)));
    }

    findWorkById(workId: number): Observable<WorkModel> {
        return this._http.get<WorkModel>(`${this._url}/${workId}`);
    }

    createWorkJson(dto:any): Observable<void> {
        return this._http.post<void>(this._url, dto);
    }

    createWork(dto: any): Observable<void> {
        const token = localStorage.getItem('jwt_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this._http.post<void>(`${this._url}/new`, dto, { headers });
    }

    updateWork(id: number, updates: Partial<WorkModel>): Observable<WorkModel> {
        return this._http.put<WorkModel>(`${this._url}/upload/${id}`, updates);
    }

    uploadWork(form: FormData): Observable<WorkDto> {
        const token = localStorage.getItem('jwt_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this._http.post<WorkDto>(`${this._url}/upload`, form, { headers });
    }

    updateWorkFull(id: number, dto: WorkDto): Observable<WorkDto> {
        return this._http.put<WorkDto>(`${this._url}/update/${id}`, dto);
    }

    toWorkModel(dto: WorkDto): WorkModel {
        return {
            workId: dto.workId,
            file: null,
            title: dto.title,
            bpm: dto.bpm,
            key: dto.key,
            audio: dto.audio,
            img: dto.img,
            user: dto.user,
            dataDiCreazione: dto.dataDiCreazione,
            nota: dto.nota
        }
    }

}