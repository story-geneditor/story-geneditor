import { Note } from './note-model';

export interface Adventure {
  id?: string;
  time: number;
  tiles: Array<Note>;
  quests: Array<any>;
}
