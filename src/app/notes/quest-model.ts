import { Note } from './note-model';

export interface Quest {
  //synced to firebase:
  deliveryitem: string;
  id?: string;
  time: number;
  //cached locally:
  destination?: Note;
}
