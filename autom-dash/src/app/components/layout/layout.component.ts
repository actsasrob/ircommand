import { Component, OnInit } from '@angular/core';

import { GridsterConfig, GridsterItem } from 'angular-gridster2'; 
import { LayoutService, IComponent } from '../../shared/services/layout.service';
import { HostListener  } from "@angular/core";

@Component({
selector: 'app-layout',
templateUrl: './layout.component.html',
styleUrls: ['./layout.component.scss'],
host: { '(click)': 'onClick()'}
})
export class LayoutComponent implements OnInit {  
    get options(): GridsterConfig {
    return this.layoutService.options;
  }  
  get layout(): GridsterItem[] {
    return this.layoutService.layout;
  }  
  get components(): IComponent[] {
    return this.layoutService.components;
  }
  constructor(
    public layoutService: LayoutService
  ) { 
    }  

  ngOnInit() {}

  @HostListener("click") onClick(){
    console.log("layout.component: User Click using Host Listener")
  }

  //private onClick() {
  //  console.log('onClick');
  //}
}
