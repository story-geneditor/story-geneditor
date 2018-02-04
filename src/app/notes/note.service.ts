import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Note } from './note-model';

import { Observable } from 'rxjs/Observable';

import { map } from 'rxjs/operators';

interface NewNote {
  content: string;
  hearts: 0;
  time: number;
  locked: false;
}

@Injectable()
export class NoteService {

  notesCollection: AngularFirestoreCollection<Note>;
  noteDocument:   AngularFirestoreDocument<Node>;
  listOfLands: string[];

  constructor(private afs: AngularFirestore) {
    this.notesCollection = this.afs.collection('notes', (ref) => ref.orderBy('time', 'desc').limit(9));

    this.listOfLands = [
      'Swamp',
      'Farms',
      'Mountains',
      'City'
    ];
  }

  randomLand() : string {
    return this.listOfLands[Math.floor(Math.random() * this.listOfLands.length)];
  }

  getData(): Observable<Note[]> {
    return this.notesCollection.valueChanges();
  }

  getSnapshot(): Observable<Note[]> {
    // ['added', 'modified', 'removed']
    return this.notesCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Note;
        return { id: a.payload.doc.id, content: data.content, hearts: data.hearts, time: data.time, locked: data.locked };
      });
    });
  }

  getNote(id: string) {
    return this.afs.doc<Note>(`notes/${id}`);
  }

  create(content: string) {
    const note = {
      content,
      hearts: 0,
      time: new Date().getTime(),
      locked: false
    };
    return this.notesCollection.add(note);
  }

  rerollAllLands() {
    /*this.tiles = */this.afs.collection('notes', ref => ref.limit(9))
     .snapshotChanges()
     .subscribe(tiles=>{
         for (var tile of tiles){
           let id = tile.payload.doc.id
           const data = tile.payload.doc.data() as Note;
           if (!data.locked) {
             this.updateNote(id, {content: this.randomLand()});
           }
         }
         //TODO: unsubscribe
       })


    //console.log(this.notesCollection.valueChanges())
    /*this.notesCollection.snapshotChanges().map((tile) => {
      console.log(tile)
    })*/
  /*  this.notesCollection.map(tile =>{
      tile.getRandomLand;
    });
  */

  }

  updateNote(id: string, data: Partial<Note>) {
    return this.getNote(id).update(data);
  }

  deleteNote(id: string) {
    return this.getNote(id).delete();
  }
}
