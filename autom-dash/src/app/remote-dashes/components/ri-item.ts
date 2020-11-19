import { Type } from '@angular/core';
import { GenericItemComponent } from './generic-item.component';
import { ButtonItemComponent } from './button-item.component';

export class RIItem {

  constructor(public component: Type<any>, 
              public data: any) {}

  // override toString to get the JSON output we need
  public toString = () : string => {
        //console.log("RIItem.toString()");
        switch(this.component) { 
           case ButtonItemComponent: { 
                return JSON.stringify({ component: 'ButtonItemComponent', data: this.data });
              //statements; 
              break; 
           } 
           default: { 
                return JSON.stringify({ component: 'GenericItemComponent', data: this.data });
              //statements; 
              break; 
           } 
        } 
    }
}
