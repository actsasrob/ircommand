import { Component, OnInit, Input } from '@angular/core';
import { LearnIR } from '../learnir';

@Component({
  selector: 'app-learnir-detail',
  templateUrl: './learnir-detail.component.html',
  styleUrls: ['./learnir-detail.component.scss']
})
export class LearnirDetailComponent implements OnInit {

  @Input() learnir: LearnIR;

  constructor() { }

  ngOnInit(): void {
  }

}
