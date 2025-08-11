import { AudioModel } from "../audio-model";
import { UserModel } from "../user-model";
import { WorkModel } from "../work-model";

export interface WorkDto {
  workId: number;
  file: File | null;
  title: string;
  bpm: number;
  key: string;
  audio: AudioModel;
  img: string;
  user: {
        userId: number;
        userName: string;
        artName: string;
        email: string;
        },
  dataDiCreazione: Date;
  nota: string | null;
}