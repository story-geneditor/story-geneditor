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

  getRandomLand(val: number) {
    //TODO
  }

  toggleLock() {
    //TODO
  }

  deleteNote(id: string) {
    //TODO
  }

}
