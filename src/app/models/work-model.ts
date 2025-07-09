import { AudioModel } from "./audio-model"
import { NoteModel } from "./note-model"
import { UserModel } from "./user-model"

export interface WorkModel {
    workId: number,
    title: string,
    bpm: number,
    key: string,
    audio: AudioModel,
    img: string,
    userId: number,
    dataDiCreazione: Date,
    nota: NoteModel|null,
    users: UserModel[]|null;
}
