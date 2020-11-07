import { Injectable } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';

export interface IComponent {
  id: string;
  componentRef: string;
  label: string;
  IRSignal: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteDashLayoutService {  
  public options: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: 'always',
    draggable: {
      enabled: true
    },
    pushItems: true,
    resizable: {
      enabled: true
    }
  };  
   public layout: GridsterItem[] = [];  
   //public layout: GridsterItem[] = [{"cols":5,"id":"5d5bd504-45ed-b0cd-ef84-dfe5c148368c","rows":5,"x":0,"y":0},{"cols":5,"id":"229098d2-a233-f0ba-20ed-c91e1cf55aad","rows":5,"x":0,"y":5},{"cols":5,"id":"8646833d-8cc9-4f32-5021-c564cba5ccea","rows":5,"x":5,"y":0},{"cols":5,"id":"e8318ac0-42d6-cdda-e7d9-71c7873a3cfb","rows":5,"x":0,"y":0}];  

   public components: IComponent[] = [];
   //public components: IComponent[] = [{"id":"5d5bd504-45ed-b0cd-ef84-dfe5c148368c","componentRef":"example1"},{"id":"229098d2-a233-f0ba-20ed-c91e1cf55aad","componentRef":"example2"},{"id":"8646833d-8cc9-4f32-5021-c564cba5ccea","componentRef":"example1"}]; 

   dropId: string;

   constructor() { }  

   addItem(): void {
       //console.log("LayoutService.addItem()");
       let myUUID = UUID.UUID();
       this.layout.push({
         cols: 5,
         id: myUUID,
         rows: 5,
         x: 0,
         y: 0
       });

     //console.log("LayoutService.addItem(): id=" + myUUID);
     //console.log("LayoutService.addItem: layout" + JSON.stringify(this.layout));
     //console.log("LayoutService.addItem: components" + JSON.stringify(this.components));
     }  

   deleteItem(id: string): void {
       console.log("LayoutService.deleteItem(): id=" + JSON.stringify(id));
       let jsonObject = JSON.parse(JSON.stringify(id));
       const item = this.layout.find(d => d.id === jsonObject.id);
       this.layout.splice(this.layout.indexOf(item), 1);
       const comp = this.components.find(c => c.id === jsonObject.id);
       //console.log("LayoutService.deleteItem(): comp=" + JSON.stringify(comp));
       this.components.splice(this.components.indexOf(comp), 1);
   }
   
   setDropId(dropId: string): void {
     //console.log("LayoutService.setDropId()");
     this.dropId = dropId;
   }
   
   dropItem(dragId: string): void {  
     //console.log("LayoutService.dropItem()");
     const { components } = this;  
     const comp: IComponent = components.find(c => c.id === this.dropId);
     
     const updateIdx: number = comp ? components.indexOf(comp) : components.length;  
     const componentItem: IComponent = {
       id: this.dropId,
       componentRef: dragId,
       label: "notset",
       IRSignal: "notset",
     };  
     this.components = Object.assign([], components, { [updateIdx]: componentItem });
   }
   
   getComponentRef(id: string): string {
     //console.log("LayoutService.getComponentRef()");
     const comp = this.components.find(c => c.id === id);
     return comp ? comp.componentRef : null;
   }
}
