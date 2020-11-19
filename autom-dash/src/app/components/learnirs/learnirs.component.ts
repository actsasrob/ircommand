import { Component, OnInit } from '@angular/core';
import { LearnIR } from '../learnir';
import { LEARNIRS } from '../mock-learnirs';

@Component({
  selector: 'app-learnirs',
  templateUrl: './learnirs.component.html',
  styleUrls: ['./learnirs.component.scss']
})
export class LearnirsComponent implements OnInit {
  learnirs = LEARNIRS;

  selectedLearnIR: LearnIR;
  onSelect(learnir: LearnIR): void {
    this.selectedLearnIR = learnir;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onClick(event: Event) {
     event.stopPropagation();
     console.log("Learnirs.onClick(): " + event.target);
  }

  onEdit(event) {
     event.stopPropagation();
     console.log("Learnirs.onEdit(): " + event.target);
  }
/*
<!--
<ul class="learnirs">
  <li *ngFor="let learnir of learnirs" (click)="onSelect(learnir)"
    [class.selected]="learnir === selectedLearnIR"
    (click)="onSelect(learnir)">
    <span class="badge">{{learnir.id}}</span> {{learnir.location}} {{learnir.ip_address}}
  </li>
</ul>
-->
*/
}
