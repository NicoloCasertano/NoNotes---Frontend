import { AudioModel } from "./audio-model"

export interface WorkModel {
    workId: number,
    file: File|null,
    title: string,
    bpm: number,
    key: string,
    audio: AudioModel,
    img: string,
    user: {
        userId: number;
        userName: string;
        artName: string;
        email: string;
    },
    dataDiCreazione: Date;
    nota: string|null,
}
