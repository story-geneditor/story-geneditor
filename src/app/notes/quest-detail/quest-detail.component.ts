import { Component, Input } from '@angular/core';

import { NoteService } from '../note.service';

import { Quest } from '../quest-model';

@Component({
  selector: 'quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
})
export class QuestDetailComponent {

  @Input()
  quest: Quest;

  constructor(private noteService: NoteService) { }

  getRandomItem() {
    var randomItem = this.noteService.randomItem();
    // console.log(typeof randomLand)
    if (this.quest.id){
      this.noteService.updateQuest(this.quest.id, { deliveryitem: randomItem});
    }
  }

  toggleLock() {
    console.log(this.quest.destination)
    console.log(this.quest.destination.id)
    console.log(this.quest.destination.landname)
    //TODO
  }

  deleteQuest() {
    if (this.quest.id){
      this.noteService.deleteQuest(this.quest.id)
    }
  }

}
