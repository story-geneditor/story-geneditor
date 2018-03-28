import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Note } from './note-model';

import { Quest } from './quest-model';

import { Observable } from 'rxjs/Observable';

import { map } from 'rxjs/operators';

import 'rxjs/add/operator/first';

interface NewNote {
  content: string;
  hearts: 0;
  time: number;
  locked: false;
}

@Injectable()
export class NoteService {

  notesCollection: AngularFirestoreCollection<Note>;
  questsCollection: AngularFirestoreCollection<Quest>;
  noteDocument:   AngularFirestoreDocument<Node>;
  listOfLands: string[];
  listOfItems: string[];

  constructor(private afs: AngularFirestore) {
    this.notesCollection = this.afs.collection('notes', (ref) => ref.orderBy('time', 'desc').limit(9));
    this.questsCollection = this.afs.collection('quests', (ref) => ref.orderBy('deliveryitem', 'desc').limit(1));

    this.listOfLands = [
      'Swamp',
      'Farms',
      'Mountains',
      'City'
    ];

    this.listOfItems = [
      'the one ring',
      'the deathstar plans',
      'the tessaract cube'
    ];
  }

  randomLand() : string {
    return this.listOfLands[Math.floor(Math.random() * this.listOfLands.length)];
  }

  randomItem() : string {
    return this.listOfItems[Math.floor(Math.random() * this.listOfItems.length)];
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

  getQuestSnapshot(): Observable<Quest[]> {
    return this.questsCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Quest;
        return { id: a.payload.doc.id, deliveryitem: data.deliveryitem };
      });
    });
  }

  getNote(id: string) {
    return this.afs.doc<Note>(`notes/${id}`);
  }

  getQuest(id: string) {
    return this.afs.doc<Quest>(`quests/${id}`);
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
    var tiles = this.afs.collection('notes', ref => ref.limit(9))
    console.log(tiles)

    this.afs.collection('notes', ref => ref.limit(9))
     .snapshotChanges()
     .first()
     .subscribe(tiles=>{
         for (var tile of tiles){
           let id = tile.payload.doc.id
           const data = tile.payload.doc.data() as Note;
           console.log (id, data)
           if (!data.locked) {
             this.updateNote(id, {content: this.randomLand()});
           }
         }
       })

  }

  deleteAndRemake() {
    var mapSize = 9;
    this.afs.collection('notes', ref => ref.limit(9))
     .snapshotChanges()
     .first()
     .subscribe(tiles=>{
       for (var tile of tiles){
         let id = tile.payload.doc.id;
         this.getNote(id).delete();
       }
     });
     for (var step = 0; step < mapSize; step++) {
       this.create(this.randomLand());
     }
  }

  updateNote(id: string, data: Partial<Note>) {
    return this.getNote(id).update(data);
  }

  updateQuest(id: string, data: Partial<Quest>) {
    return this.getQuest(id).update(data);
  }

  deleteNote(id: string) {
    return this.getNote(id).delete();
  }
}
