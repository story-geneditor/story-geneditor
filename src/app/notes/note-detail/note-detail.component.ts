import { Component, Input } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

@Component({
  selector: 'note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
})
export class NoteDetailComponent {

  @Input()
  note: Note;

  constructor(private noteService: NoteService) { }

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
      var randomLand = this.noteService.randomizeLand(this.note.id);
  }

  toggleLock() {
    if (this.note.id){
      this.noteService.updateNote(this.note.id, {locked: !this.note.locked});
    }
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(id);
  }

}
