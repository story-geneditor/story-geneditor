import { Component, OnInit } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    // this.notes = this.noteService.getData()
    this.notes = this.noteService.getSnapshot();
  }

  createNote() {
    /*console.log(this.notes);
    this.notes.subscribe( x => { return console.log(x); });
    console.log(this.noteService.notesCollection);
    console.log(this.noteService.notesCollection.length);

    return;*/

    this.noteService.create(this.content);
    this.content = '';
  }

  rerollAllLands() {
    //console.log(tiles);
    /*this.notes.subscribe(tile => {
        console.log(tile)
      })*/
    this.noteService.rerollAllLands();
  }
}
