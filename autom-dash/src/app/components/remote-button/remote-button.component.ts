import { Component, Input, OnInit } from '@angular/core';
import { HostListener  } from "@angular/core";

@Component({
  selector: 'app-remote-button',
  templateUrl: './remote-button.component.html',
  styleUrls: ['./remote-button.component.scss'],
  //host: { '(click)': 'onClick()'}
})
export class RemoteButtonComponent implements OnInit {
  @Input() id: string;

  public label: string = 'foo1';
  public IRSignal: string;

  constructor() {}

  ngOnInit(): void {
     console.log("RemoteButtonComponent.ngOnInit(): ");
  }

}
