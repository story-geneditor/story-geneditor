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
  adventureDocument: AngularFirestoreDocument<Adventure>;
  noteDocument:   AngularFirestoreDocument<Node>;
  listOfItems: string[];
  listOfLandTypes: string[];
  listOfLandNames: string[];
  adventureID: string;

  constructor(private afs: AngularFirestore) {
    this.notesCollection = this.afs.collection('notes', (ref) => ref.orderBy('time', 'desc').limit(9));
    this.questsCollection = this.afs.collection('quests', (ref) => ref.orderBy('time', 'asc').limit(5));
    this.adventuresCollection = this.afs.collection('adventures', (ref) => ref.orderBy('time', 'asc').limit(1));
    this.adventureDocument = this.afs.doc<Adventure>(`adventures/wY0YFQAQE9hfHuoDAe6a`);

    this.adventureID = "wY0YFQAQE9hfHuoDAe6a"


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

  randomizeLand(tileArrayIndex: any) {
    var randomLandType = this.listOfLandTypes[Math.floor(Math.random() * this.listOfLandTypes.length)];
    var randomLandName = this.listOfLandNames[Math.floor(Math.random() * this.listOfLandNames.length)];

    var updatedTileData = {
      tileIndex: tileArrayIndex,
      updateFields: [
        {
          key: "landname",
          value: randomLandName
        },
        {
          key: "landtype",
          value: randomLandType
        }
      ]
    }

    // TODO refactor this next part into the updateTile function

    this.afs.doc('adventures/wY0YFQAQE9hfHuoDAe6a')
     .snapshotChanges()
     .first()
     .subscribe(adventure=>{
        var currentTiles = adventure.payload.data().tiles

        this.updateTile(currentTiles, updatedTileData)

      })
  }

  toggleTileLock(tileArrayIndex: any, lockState: boolean) {
    var updatedTileData = {
      tileIndex: tileArrayIndex,
      updateFields: [
        {
          key: "locked",
          value: !lockState
        }
      ]
    }

    this.afs.doc('adventures/wY0YFQAQE9hfHuoDAe6a')
     .snapshotChanges()
     .first()
     .subscribe(adventure=>{
        var currentTiles = adventure.payload.data().tiles

        this.updateTile(currentTiles, updatedTileData)

      })
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
          index: data.index,
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
        //console.log('mapping quests:', a.payload.doc.data())
        const data = a.payload.doc.data() as Quest;
        return {
          id: a.payload.doc.id,
          time: data.time,
          deliveryitem: data.deliveryitem
        };
      });
    });
  }

  getAdventureSnapshot(): Observable<Adventure[]> {
    // ['added', 'modified', 'removed']
    console.log('getAdventureSnapshot')
    return this.adventuresCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Adventure;
        console.log('mapping data:', a.payload.doc.data())
        return {
          id: a.payload.doc.id,
          time: data.time,
          tiles: data.tiles,
          quests: data.quests
        };
      });
    });
  }

  getSingleAdventureSnapshot(): Observable<Adventure> {
    console.log('getSingleAdventureSnapshot')
    return this.adventureDocument.snapshotChanges().map((a) => {
      //console.log(a.payload)
      const data = a.payload.data() as Adventure;
      //console.log('mapping data:', a.payload.data())
      return {
        id: a.payload.id,
        time: data.time,
        tiles: data.tiles,
        quests: data.quests
        };
    });
  }

  getNote(id: string) {
    return this.afs.doc<Note>(`notes/${id}`);
  }

  getQuest(id: string) {
    return this.afs.doc<Quest>(`quests/${id}`);
  }

  getAdventure(id: string) {
    return this.afs.doc<Adventure>(`adventures/${id}`)
  }

  create() {
    const note = {
      landtype: "LandType",
      landname: "LandName",
      hearts: 0,
      index: 0,
      time: new Date().getTime(),
      locked: false
    };
    return this.notesCollection.add(note);;
  }

  createQuest() {
    const newQuest = {
      deliveryitem: this.randomItem(),
      time: new Date().getTime()
    };

    this.afs.doc('adventures/wY0YFQAQE9hfHuoDAe6a')
     .snapshotChanges()
     .first()
     .subscribe(adventure=>{
        var currentQuests = adventure.payload.data().quests;

        currentQuests.push(newQuest)

        this.updateAdventure(this.adventureID, {quests: currentQuests});

      })

    //return this.questsCollection.add(quest);
  }

  rerollAllLands() {
    this.afs.doc('adventures/wY0YFQAQE9hfHuoDAe6a')
     .snapshotChanges()
     .first()
     .subscribe(adventure=>{
        var currentTiles = adventure.payload.data().tiles;

        for (var tile in currentTiles) {
          if (!currentTiles[tile].locked){
            currentTiles[tile].landtype = this.listOfLandTypes[Math.floor(Math.random() * this.listOfLandTypes.length)];
            currentTiles[tile].landname = this.listOfLandNames[Math.floor(Math.random() * this.listOfLandNames.length)];
          }
        }

        this.updateAdventure(this.adventureID, {tiles: currentTiles});

      })
  }

  deleteAndRemake() {
    console.log("deleteAndRemake");
    var mapSize = 9;

    var newTiles = []

    for (var i = 0; i < mapSize; i++){
      newTiles.push(
        {
          index: i,
          landname: this.listOfLandNames[Math.floor(Math.random() * this.listOfLandNames.length)],
          landtype: this.listOfLandTypes[Math.floor(Math.random() * this.listOfLandTypes.length)],
          time: new Date().getTime(),
          locked: false
        }
      )
    }

    console.log(newTiles);
    this.updateAdventure(this.adventureID, {tiles: newTiles});

    /*
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
     */
  }

  updateNote(id: string, data: Partial<Note>) {
    return this.getNote(id).update(data);
  }

  updateTile(newTiles: any, updateTileData: any) {
    console.log("updateTile :", newTiles);
    console.log("fields: ", updateTileData.updateFields);
    //console.log("that one tile: ", newTiles[0]);

    updateTileData.updateFields.forEach( function (field: any){

      newTiles[updateTileData.tileIndex][field.key] = field.value;

    })

    return this.getAdventure(this.adventureID).update({tiles: newTiles});
  }

  updateQuest(newQuests: any, updateQuestData: any) {

    updateQuestData.updateFields.forEach( function (field: any){

      newQuests[updateQuestData.tileIndex][field.key] = field.value;

    })

    return this.getAdventure(this.adventureID).update({quests: newQuests});

    // return this.getQuest(id).update(data);

  }

  updateAdventure(id: string, data: Partial<Adventure>) {
    console.log(data)
    return this.getAdventure(id).update(data);
  }

  deleteNote(id: string) {
    return this.getNote(id).delete();
  }

  deleteQuest(id: string){
    return this.getQuest(id).delete();
  }
}
