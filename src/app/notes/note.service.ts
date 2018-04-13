import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Note } from './note-model';

import { Quest } from './quest-model';

import { Adventure } from './adventure-model';

import { Observable } from 'rxjs/Observable';

import { map } from 'rxjs/operators';

import 'rxjs/add/operator/first';

// interface NewNote {
//   content: string;
//   hearts: 0;
//   time: number;
//   locked: false;
// }

@Injectable()
export class NoteService {

  notesCollection: AngularFirestoreCollection<Note>;
  questsCollection: AngularFirestoreCollection<Quest>;
  adventuresCollection: AngularFirestoreCollection<Adventure>;
  noteDocument:   AngularFirestoreDocument<Node>;
  listOfItems: string[];
  listOfLandTypes: string[];
  listOfLandNames: string[];

  constructor(private afs: AngularFirestore) {
    this.notesCollection = this.afs.collection('notes', (ref) => ref.orderBy('time', 'desc').limit(9));
    this.questsCollection = this.afs.collection('quests', (ref) => ref.orderBy('time', 'asc').limit(5));
    this.adventuresCollection = this.afs.collection('adventures', (ref) => ref.orderBy('time', 'asc').limit(1));

    this.listOfLandTypes = [
      'Swamp',
      'Farms',
      'Mountains',
      'City'
    ];

    this.listOfLandNames = [
      'Proud',
      'Dubious',
      'Lofty',
      'Weird',
      'Sprawling'
    ];

    this.listOfItems = [
      'the one ring',
      'the deathstar plans',
      'the holy grail',
      'the lost arc',
      'true love',
      'the fountain of youth'
    ];

  }

  randomizeLand(id: string) {
    console.log("randomizeLand " + id);
    var randomLandType = this.listOfLandTypes[Math.floor(Math.random() * this.listOfLandTypes.length)];
    var randomLandName = this.listOfLandNames[Math.floor(Math.random() * this.listOfLandNames.length)];
    this.updateNote(id, {landtype: randomLandType, landname: randomLandName});
  }

  randomItem() : string {
    return this.listOfItems[Math.floor(Math.random() * this.listOfItems.length)];
  }

  getSnapshot(): Observable<Note[]> {
    // ['added', 'modified', 'removed']
    console.log('getSnapshot')
    return this.notesCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Note;
        return {
          id: a.payload.doc.id,
          landname: data.landname,
          landtype: data.landtype,
          hearts: data.hearts,
          time: data.time,
          locked: data.locked
        };
      });
    });
  }

  getQuestSnapshot(): Observable<Quest[]> {
    console.log('getQuestSnapshot')
    return this.questsCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Quest;
        return { id: a.payload.doc.id, time: data.time, deliveryitem: data.deliveryitem };
      });
    });
  }

  getNote(id: string) {
    return this.afs.doc<Note>(`notes/${id}`);
  }

  getQuest(id: string) {
    return this.afs.doc<Quest>(`quests/${id}`);
  }

  create() {
    const note = {
      landtype: "LandType",
      landname: "LandName",
      hearts: 0,
      time: new Date().getTime(),
      locked: false
    };
    return this.notesCollection.add(note);;
  }

  createQuest() {
    const quest = {
      deliveryitem: this.randomItem(),
      time: new Date().getTime()
    };
    return this.questsCollection.add(quest);
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
             this.randomizeLand(id);
           }
         }
       })

  }

  deleteAndRemake() {
    console.log("deleteAndRemake");
    var mapSize = 9;
    //create
    this.afs.collection('notes')
     .snapshotChanges()
     .first()
     .subscribe(tiles=>{
       for (var tile of tiles){
         let id = tile.payload.doc.id;
         this.getNote(id).delete();
       }
     });
     for (var step = 0; step < mapSize; step++) {
       this.create();
     }

     //then as a second step, randomize:
     this.rerollAllLands();
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

  deleteQuest(id: string){
    return this.getQuest(id).delete();
  }
}
