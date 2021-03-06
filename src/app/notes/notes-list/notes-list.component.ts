import { Component, OnInit } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';
import { Quest } from '../quest-model';
import { Adventure } from '../adventure-model'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {

  notes: Observable<Note[]>;
  quests: Observable<Quest[]>;
  adventures: Observable<Adventure[]>;
  adventure: Observable<Adventure>;
  content: string;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    // this.notes = this.noteService.getData()
    this.notes = this.noteService.getSnapshot();
    this.quests = this.noteService.getQuestSnapshot();
    // this.adventures = this.noteService.getAdventureSnapshot();
    // this.adventure = this.noteService.getAdventure('wY0YFQAQE9hfHuoDAe6a').snapshotChanges();
    this.adventure = this.noteService.getSingleAdventureSnapshot();
    //console.log(this.adventure);
  }

  createNote() {
    /*console.log(this.notes);
    this.notes.subscribe( x => { return console.log(x); });
    console.log(this.noteService.notesCollection);
    console.log(this.noteService.notesCollection.length);

    return;*/

    //Formerly, this.content was used to create a tile with a specific label
    // this.noteService.create(this.content);
    // this.content = '';
    this.noteService.create();
  }

  createQuest(){
    this.noteService.createQuest()
  }

  rerollAllLands() {
    //console.log(tiles);
    /*this.notes.subscribe(tile => {
        console.log(tile)
      })*/
    this.noteService.rerollAllLands();
  }

  deleteAndRemake() {
    this.noteService.deleteAndRemake();
  }
}
