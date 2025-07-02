import { NoteModel } from "./note-model";
import { WorkModel } from "./work-model";

export interface NoteRequestModel {
    utenteId: number
    note: NoteModel,
    workId: number
}