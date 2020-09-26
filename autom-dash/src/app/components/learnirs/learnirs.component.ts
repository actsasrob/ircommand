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

}
