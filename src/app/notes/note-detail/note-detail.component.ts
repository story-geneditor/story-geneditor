import { Component, Input } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

import { Adventure } from '../adventure-model';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
})
export class NoteDetailComponent {

  @Input()
  note: Note;
  //adventure: Observable<Adventure>;

  constructor(private noteService: NoteService) { }

  //ngOnInit() {
    //this.adventure = this.noteService.getSingleAdventureSnapshot();
  //}

  addHeartToNote(val: number) {
    if (this.note.id) {
      this.noteService.updateNote(this.note.id, { hearts: val + 1 });
    } else {
      console.error('Note missing ID!');
    }
  }

  getRandomLand() {
      if (this.note.locked) {
        return;
      }
      if (this.note.time) {
        this.noteService.randomizeLand(this.note.index);
      }
  }

  toggleLock() {
    if (this.note.time){
      this.noteService.toggleTileLock(this.note.index, this.note.locked);
    }
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(id);
  }

}
